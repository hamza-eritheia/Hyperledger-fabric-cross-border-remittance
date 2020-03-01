require('dotenv').config()

const ldap = require('ldapjs')
const Promise = require('bluebird')
//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ldapOptions = {
    url: "ldap://localhost:389",
    connectTimeout: 30000,
    reconnect: true
}

var LDAP_BASE_DN = 'dc=example, dc=com'

let addUser = (userId, givenName, familyName, password) => {
    return new Promise ((resolve, reject) => {
        const ldapClient = ldap.createClient(ldapOptions)

        ldapClient.bind(
            'cn=admin, ' + LDAP_BASE_DN,
            'admin',
            (err) => {
                if(err) return reject(err)
                
                let newUser = {
                    uid: userId,
                    cn: givenName,          //common name
                    sn: familyName,         //sur name
                    userPassword: password,
                    objectClass: ["Person", "organizationalPerson", "inetOrgPerson"]
                }

                ldapClient.add(
                    'cn=' + userId + ', ' + LDAP_BASE_DN,
                    newUser,
                    (err, resp) => {
                        if (err) return reject(err)
                        return resolve(resp)
                    }
                )
            }
        )
    })
}

let searchUser = (userId) => {
    return new Promise((resolve, reject) => {
        const ldapClient = ldap.createClient(ldapOptions)
        const result = []
        let options = {
            filter: "(cn=" + userId + ")",
            scope: 'sub'
        }
        ldapClient.search(
            LDAP_BASE_DN,
            options,
            (err, resp) => {
                if (err) return reject(err)
                resp.on('searchEntry', (entry) => {
                    result.push(JSON.stringify(entry.object))
                })
                resp.on('end', (res) => {
                    console.log(res.status)
                    return resolve(result[0])
                })
            }
        )
    })
}

let modifyUser = (userId, modify) => {
    return new Promise ((resolve, reject) => {
        const ldapClient = ldap.createClient(ldapOptions)

        ldapClient.bind(
            'cn=admin, ' + LDAP_BASE_DN,
            'admin',
            (err) => {
                if(err) return reject(err)

                var change = new ldap.Change({
                    operation: 'replace',
                    modification: modify
                })

                ldapClient.modify(
                    'cn=' + userId + ', ' + LDAP_BASE_DN,
                    change,
                    (err, resp) => {
                        if (err) return reject(err)
                        return resolve(resp)
                    }
                )
            }
        )
    })
}

let removeUser = (userId) => {
    return new Promise ((resolve, reject) => {
        const ldapClient = ldap.createClient(ldapOptions)

        ldapClient.bind(
            'cn=admin, ' + LDAP_BASE_DN,
            'admin',
            (err) => {
                if(err) return reject(err)

                ldapClient.del(
                    'cn=' + userId + ', ' + LDAP_BASE_DN,
                    (err, resp) => {
                        if (err) return reject(err)
                        return resolve(resp)
                    }
                )
            }
        )
    })
}

let loginUser = (userId, password) => {
    return new Promise((resolve, reject) => {
        const ldapClient = ldap.createClient(ldapOptions)

        ldapClient.bind(
            'cn=' + userId + ', ' + LDAP_BASE_DN,
            password,
            (err, resp) => {
                if (err) return reject(err)
                return resolve(resp)
            }
        )
    })
}

const createUser = (req, resp) => {
    //const salt = await bcrypt.genSalt()
    //const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //console.log(salt)
    //console.log(hashedPassword)
    addUser(req.body.userId, req.body.firstName, req.body.lastName, req.body.password)
    .then((res) => resp.status(201).send("Created Successfull!!\n"), (err) => resp.sendStatus(401))
}

const getUser = (req, resp) => {
    searchUser(req.params.userName)
    .then((res) => resp.send(res), (err) => resp.sendStatus(401))
}

const updateUser = (req, resp) => {
    let varToModify

    if(typeof req.body.firstName != typeof undefined)
        varToModify = {"cn": req.body.firstName}
    else if(typeof req.body.lastName != typeof undefined)
        varToModify = {"sn": req.body.lastName}
    else
        varToModify = {"userPassword": req.body.password}

    modifyUser(req.params.userName, varToModify)
    .then((res) => resp.status(201).send("User Modified Successfully!!\n"), (err) => resp.sendStatus(401))
}

const deleteUser = (req, resp) => {
    removeUser(req.params.userName)
    .then((res) => resp.status(201).send("User Deleted Successfully!!\n"), (err) => resp.sendStatus(401))
}

const authenticate = (req, resp) => {
    try{
        loginUser(req.body.userName, req.body.password)
        .then((res) => {
            const accessToken = jwt.sign( {name: req.body.userName}, process.env.ACCESS_TOKEN_SECRET)
            resp.status(201).json({accessToken: accessToken})
            
        }, (err) => resp.status(401).send({message: "Password didnt matched!!\n"}))
    }
    catch(err) {
        resp.status(400).send(err)
    }
}

module.exports = {
    createUser, getUser, updateUser, deleteUser, authenticate
}