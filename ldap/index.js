'use strict'

const ldap = require('ldapjs')
const Promise = require('bluebird')
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
                    givenName: 'none',
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

let authenticate = (userId, password) => {
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

module.exports = { addUser, authenticate }