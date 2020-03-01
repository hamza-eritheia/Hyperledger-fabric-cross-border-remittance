require('dotenv').config()

const express = require('express')
const  bodyParser = require('body-parser')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const ip = require('ip');
const app = express()
const routes = require('./routes')
const cors = require('cors')

async function main() {
    routes.generateIdentities();

    app.use(cors(), bodyParser.json(), bodyParser.urlencoded({ extended: true }), logger('dev'), errorHandler())

    //Transactions
    app.get('/transactions/:bankId/out', (req, resp) => {
        routes.transactions.getTransSent(req, resp);
    })
    app.get('/transactions/:bankId/in', (req, resp) => {
        routes.transactions.getTransRecieved(req, resp);
    })
    app.get('/transactions/:bankId/out/:Id', (req, resp) => {
        routes.transactions.getTransSentById(req, resp);
    })
    app.get('/transactions/:bankId/in/:Id', (req, resp) => {
        routes.transactions.getTransRecievedById(req, resp);
    })
    app.post('/transactions/:bankId', (req, resp) => { //query parameter = status
        routes.transactions.submitTrans(req, resp);
    })

    //Users
    app.post('/user', routes.authenticateToken, (req, resp) => {
        routes.users.createUser(req, resp)
    })
    app.get('/user/:userName', (req, resp) => {
        routes.users.getUser(req, resp)
    })
    app.put('/user/:userName', routes.authenticateToken, (req, resp) => {
        routes.users.updateUser(req, resp)
    })
    app.delete('/user/:userName', routes.authenticateToken, (req, resp) => {
        routes.users.deleteUser(req, resp)
    })
    app.post('/user/login', (req, resp) => {
        routes.users.authenticate(req, resp)
    })
    app.get('/user/logout', routes.authenticateToken, (req, resp) => {
        resp.sendStatus(200)
    })

    app.listen(process.env.PORT , () => console.log(`Server started at ${ip.address()}:${process.env.PORT}`));

}

main().then(() => {

    console.log('Main program complete.');

}).catch((e) => {

    console.log('Main program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});