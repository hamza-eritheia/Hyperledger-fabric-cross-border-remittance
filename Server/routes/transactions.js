'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '../../remittance-network', 'connection-org1.json');

async function connect(userName) {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userName);
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('ucpchannel');

    // Get the contract from the network.
    const contract = network.getContract('remittancecc');

    return [contract, gateway];
}

async function issue(from, to, sender, reciever, tx, txDate, amount, fx, final) {
    const ret = await connect('user1')
    const contract = ret[0]
    const gateway = ret[1]

    // Submit the specified transaction.
    //const log = await contract.submitTransaction('issue', 'Mcb', 'BankOfChina', 'Guru Jee', 'Osama', 'Tx #2', '21 Dec', '100', '1.0', '1');
    const log = await contract.submitTransaction('issue', from, to, sender, reciever, tx, txDate, amount, fx, final);
    
    await gateway.disconnect();
    return log;
}

async function accept(from, to, sender, reciever, tx, txDate, amount) {
    const ret = await connect('user1')
    const contract = ret[0]
    const gateway = ret[1]

    const log = await contract.submitTransaction('accept', from, to, sender, reciever, tx, txDate, amount);
    
    await gateway.disconnect();
    return log;
}

async function reject(from, to, sender, reciever, tx, txDate, amount) {
    const ret = await connect('user1')
    const contract = ret[0]
    const gateway = ret[1]

    const log = await contract.submitTransaction('reject', from, to, sender, reciever, tx, txDate, amount);
    
    await gateway.disconnect();
    return log;
}

async function queryTrans(tx) {
    const ret = await connect('user1')
    const contract = ret[0]
    const gateway = ret[1]
    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('queryTransaction', tx);

    await gateway.disconnect();
    return JSON.parse(result);
}

async function queryAllTrans(EndTx = 'Tx #999') {
    const ret = await connect('user1')
    const contract = ret[0]
    const gateway = ret[1]
    const result = await contract.evaluateTransaction('queryAllTransactions', 'Tx #0', EndTx);

    await gateway.disconnect();
    return JSON.parse(result);
}

const getTransSent = async (req, resp) => {
    try{
        const bankId = req.params.bankId
        const res = await queryAllTrans('Tx #' + 999)
        let txs = [];
        let bankName;

        if(bankId > 1)
            throw("Wrong Bank Id")

        if(bankId == 0)
            bankName = 'Mcb'
        else
            bankName = 'BankOfChina'

        for (let i = 0; i < res.length; i++) {
            if(res[i].Record.from == bankName)
                txs.push(res[i])      
        }

        resp.send(txs)
    }
    catch(err){
        console.log(err)
        resp.send({error: err}).status(404)
    }

}

const getTransRecieved = async (req, resp) => {
    try{
        const bankId = req.params.bankId
        const res = await queryAllTrans('Tx #' + 999)
        let txs = [];
        let bankName;

        if(bankId > 1)
            throw("Wrong Bank Id")

        if(bankId == 0)
            bankName = 'Mcb'
        else
            bankName = 'BankOfChina'

        for (let i = 0; i < res.length; i++) {
            if(res[i].Record.to == bankName)
                txs.push(res[i])      
        }

        resp.send(txs)
    }
    catch(err){
        console.log(err)
        resp.send({error: err}).status(404)
    }
}

const getTransSentById = async (req, resp) => {
    try{
        const txId = req.params.Id
        const bankId = req.params.bankId
        const res = await queryTrans('Tx #' + txId)
        let bankName;

        if(bankId > 1)
            throw("Wrong Bank Id")

        if(bankId == 0)
            bankName = 'Mcb'
        else
            bankName = 'BankOfChina'

        if(res.from == bankName)
            resp.send(res)
        else
            throw("No transaction of this id")
    }
    catch(err){
        console.log(err)
        resp.send({error: err}).status(404)
    }
}

const getTransRecievedById = async (req, resp) => {
    try{
        const txId = req.params.Id
        const bankId = req.params.bankId
        const res = await queryTrans('Tx #' + txId)
        let bankName;

        if(bankId > 1)
            throw("Wrong Bank Id")
        if(bankId == 0)
            bankName = 'Mcb'
        else
            bankName = 'BankOfChina'

        if(res.to == bankName)
            resp.send(res)
        else
            throw("No transaction of this id")
    }
    catch(err){
        console.log(err)
        resp.send({error: err}).status(404)
    }
}

const submitTrans = async (req, resp) => {
    const bankId = req.params.bankId;
    const status = req.query.status;
    const from = req.body.from;
    const to = req.body.to;
    const sender = req.body.sender;
    const reciever = req.body.reciever;
    const tx = req.body.tx;
    const txDate = req.body.txDate;
    const amount = req.body.amount;

    try{
        if(bankId > 1)
            throw("Wrong Bank Id")

        if((from != "Mcb" && from != "BankOfChina") || (to != "Mcb" && to != "BankOfChina"))
            throw("Wrong Bank Transaction")

        /*************************** Starts Here ******************************/    

        if(status == 'reject'){
            const res = await reject(from, to, sender, reciever, tx, txDate, amount)
            console.log(res.toString());

            resp.sendStatus(201);
        }
        else if (status == 'accept') {
            const res = await accept(from, to, sender, reciever, tx, txDate, amount)
            console.log(res.toString());

            resp.sendStatus(201);
        }
        else {
            const res = await issue(from, to, sender, reciever, tx, txDate, amount, req.body.fx, req.body.final)
            console.log(res.toString());

            resp.send(JSON.stringify({Message : `Transaction with number ${tx} has been submitted successfully on ${txDate}`}));
        }
    }
    catch(err) {
        console.log(err.endorsements[1])
        resp.status(500).send(err.endorsements[1])
    }
}

module.exports = {
    getTransSent, getTransRecieved, getTransSentById, getTransRecievedById, submitTrans
}

//check for banks that transaction accept reject are different banks
//sent trans check