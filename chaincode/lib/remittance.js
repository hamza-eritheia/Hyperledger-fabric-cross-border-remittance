'use strict';
//Check for banks in issue function
//Change initLedger function according to other functions
//Register Banks Functions

const { Contract } = require('fabric-contract-api');

class RemittanceContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        const Transactions = [
            {
                from: 'Mcb',
                to: 'BankOfChina',
                sender: 'Hamza',
                reciever: 'Ibrahim',
                tx: 'Tx #0',
                issuedOn: '28 Oct',
                confirmedOn: '28 Oct',
                amount: 10,
                fxRate: 1.0,
                final: 0,
                currentState: 'Confirmed'
            },
            {
                from: 'BankOfChina',
                to: 'Mcb',
                sender: 'Taha',
                reciever: 'Ahmed',
                tx: 'Tx #1',
                issuedOn: '28 Oct',
                rejectedOn: '29 Oct',
                amount: 20,
                fxRate: 1.0,
                final: 0,
                currentState: 'Rejected'
            }
        ];

        const bankBalances = [
            {
                bankName: 'BankOfChina',
                Balance: 1000
            },
            {
                bankName: 'Mcb',
                Balance: 1000
            }
        ];

        for (let i = 0; i < Transactions.length; i++) {
            Transactions[i].docType = 'transaction';
            await ctx.stub.putState('Tx #' + i, Buffer.from(JSON.stringify(Transactions[i])));
            console.info('Added <--> ', Transactions[i]);
        }
        for (let i = 0; i < bankBalances.length; i++) {
            bankBalances[i].docType = 'balance';
            await ctx.stub.putState(bankBalances[i].bankName, Buffer.from(JSON.stringify(bankBalances[i])));
            console.info('Added <--> ', bankBalances[i]);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    async issue(ctx, from, to, sender, reciever, tx, issuedOn, amount, fxRate, final) {
        console.info('\n============= START : Issue Transaction ===========');

        //Handler
        const transactionAsBytes = await ctx.stub.getState(tx);         // get the transaction from chaincode state
        console.log(`${transactionAsBytes} ${transactionAsBytes.length}`)
        console.log(typeof transactionAsBytes)
        if (transactionAsBytes.length != 0) {
            const transaction = JSON.parse(transactionAsBytes.toString());

            if(transaction.currentState == "Issued"){
                throw new Error(`${tx} with this Id is already Issued by ${transaction.from}`);
            }
            else if(transaction.currentState == "Confirmed"){
                throw new Error(`${tx} with this Id is already accepted by ${transaction.to}`);
            }
            else if(transaction.currentState == "Rejected"){
                throw new Error(`${tx} with this Id is already rejected by ${transaction.to}`);
            }
            else {
                throw new Error(`${tx} with this this Id already exist`);
            }
        }
        
        const bankAsBytes = await ctx.stub.getState(from);
        console.log(`${bankAsBytes} ${bankAsBytes.length}`)
        
        if (bankAsBytes.length == 0) {
           throw new Error(`${from} bank does not exist`);
        }
        const bank = JSON.parse(bankAsBytes.toString())
        if (bank.Balance === 0) {
            throw new Error(`Bank with name ${from} does'nt have enough balance to make transaction`);
        }

        //Issue
        const transaction = {
            from,
            to,
            sender,
            reciever,
            tx,
            issuedOn,
            amount,
            fxRate,
            final,
            currentState: 'Issued'
        };

        await ctx.stub.putState(tx, Buffer.from(JSON.stringify(transaction)));
        console.info('============= END : Issue Transaction ===========');
    }

    async accept(ctx, from, to, sender, reciever, tx, acceptedOn, amount) {
        console.info('============= START : Accept Transaction ===========');

        //Handler
        const transactionAsBytes = await ctx.stub.getState(tx);         // get the transaction from chaincode state
        console.log(typeof transactionAsBytes)
        if (transactionAsBytes || transactionAsBytes.length !== 0) {
            const transaction = JSON.parse(transactionAsBytes.toString());
            if(transaction.currentState == "Confirmed"){
                throw new Error(`${tx} with this Id is already accepted by ${transaction.to}`);
            }
            else if(transaction.currentState == "Rejected"){
                throw new Error(`${tx} with this Id is already rejected by ${transaction.to}`);
            }
            else if(transaction.currentState == "Issued"){
                if (transaction.from == from && transaction.to == to && transaction.sender == sender && transaction.reciever == reciever && transaction.amount == amount){
                    let bankAsBytes = await ctx.stub.getState(from);
                    if (!bankAsBytes || bankAsBytes.length === 0)
                        throw new Error(`${from} bank does not exist`);
                    const bank1 = JSON.parse(bankAsBytes.toString())
                    bankAsBytes = await ctx.stub.getState(to);
                    if (!bankAsBytes || bankAsBytes.length === 0)
                        throw new Error(`${to} bank does not exist`);
                    const bank2 = JSON.parse(bankAsBytes.toString())

                    //Accept
                    bank1.Balance -= amount
                    bank2.Balance += amount
                    transaction.currentState = 'Confirmed'
                    transaction.acceptedOn = acceptedOn
                    await ctx.stub.putState(tx, Buffer.from(JSON.stringify(transaction)));
                    await ctx.stub.putState(from, Buffer.from(JSON.stringify(bank1)));
                    await ctx.stub.putState(to, Buffer.from(JSON.stringify(bank2)));
                    console.info('============= END : Accept Transaction ===========');
                }
            }
            else {
                throw new Error(`${tx} with this this Id does'nt already exist`);
            }
        }
        else {
            throw new Error(`${tx} with this this Id does'nt exist`);
        }
    }

    async reject(ctx, from, to, sender, reciever, tx, rejectedOn, amount) {
        console.info('============= START : Reject Transaction ===========');

        //Handler
        const transactionAsBytes = await ctx.stub.getState(tx);         // get the transaction from chaincode state
        if (transactionAsBytes || transactionAsBytes.length !== 0) {
            const transaction = JSON.parse(transactionAsBytes.toString());
            if(transaction.currentState == "Confirmed"){
                throw new Error(`${tx} with this Id is already accepted by ${transaction.to}`);
            }
            else if(transaction.currentState == "Rejected"){
                throw new Error(`${tx} with this Id is already rejected by ${transaction.to}`);
            }
            else if(transaction.currentState == "Issued"){
                if (transaction.from == from && transaction.to == to && transaction.sender == sender && transaction.reciever == reciever && transaction.amount == amount){
                    transaction.currentState = 'Rejected'
                    transaction.rejectedOn = rejectedOn
                    await ctx.stub.putState(tx, Buffer.from(JSON.stringify(transaction)));
                    console.info('============= END : Reject Transaction ===========');
                }
            }
            else {
                throw new Error(`${tx} with this this Id does'nt already exist`);
            }
        }
        else {
            throw new Error(`${tx} with this this Id does'nt exist`);
        }
    }

    async queryTransaction(ctx, tx) {
        const transactionAsBytes = await ctx.stub.getState(tx); // get the transaction from chaincode state
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`${tx} does not exist`);
        }

        const transaction = JSON.parse(transactionAsBytes.toString());
        console.log(transaction);

        return transaction;
    }

    async queryAllTransactions(ctx, startTx, endTx) {
        const iterator = await ctx.stub.getStateByRange(startTx, endTx);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async addBank(ctx, bankName, initBalance) {
        console.info('============= START : Register Bank ===========');

        //Handler        
        const bankAsBytes = await ctx.stub.getState(bankName);
        if (bankAsBytes || bankAsBytes.length !== 0) {
           throw new Error(`${bankName} bank already exist ${bankAsBytes} ${bankAsBytes.length}`);
        }

        //Register Bank
        const Bank = {
            bankName,
            Balance: initBalance,
            docType: 'Balance'
        }

        await ctx.stub.putState(Bank.bankName, Buffer.from(JSON.stringify(Bank)));
        console.info('============= END : Register Bank ===========')
    }

}

module.exports = RemittanceContract;
