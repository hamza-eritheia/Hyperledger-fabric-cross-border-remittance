const transactions = require('./transactions')
const users = require('./users')
const enrollAdmin = require('./enrollAdmin')
const registerUser = require('./registerUser')
const jwt = require('jsonwebtoken')

function generateIdentities() {
    enrollAdmin.main().then(val => registerUser.main())
    //registerUser.main()
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = {
    transactions, users, generateIdentities, authenticateToken
}