const transactions = require('./transactions')
const users = require('./users')
const enrollAdmin = require('./enrollAdmin')
const registerUser = require('./registerUser')

function generateIdentities() {
    //enrollAdmin.main()
    //registerUser.main()
}

module.exports = {
    transactions, users, generateIdentities
}