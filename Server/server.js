const express = require('express')
const  bodyParser = require('body-parser')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const ip = require('ip');
const app = express()
const routes = require('./routes')

// let store = {
//   posts: [{
//     name: "",
//     url: "",
//     text: "",
//     comments: [{
//       text: ""
//     }]
//   }]
// }



async function main() {
    routes.generateIdentities();

    app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }), logger('dev'), errorHandler())
    // app.use((req, resp, next) => {
    //   req.store = store
    //   next()
    // })

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
        //resp.send(req.body.from)
    })

    //Users
    app.post('/user', (req, resp) => {

    })
    app.get('/user/:userName', (req, resp) => {
    
    })
    app.put('/user/:userName', (req, resp) => {
    
    })
    app.delete('/user/:userName', (req, resp) => {
    
    })
    app.post('/user/login', (req, resp) => {
    
    })
    app.get('/user/logout', (req, resp) => {
    
    })

    app.listen(3000 , () => console.log(`Server started at ${ip.address()}:${3000}`));
}

main().then(() => {

    console.log('Main program complete.');

}).catch((e) => {

    console.log('Main program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});