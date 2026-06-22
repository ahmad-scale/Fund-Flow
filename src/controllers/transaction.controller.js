const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const emailService = require('../services/email.service')
const accountModel = require('../models/account.model')
const mongoose = require('mongoose')

//[Create New Transaction]
async function createTransaction(req, res) {


    // 1.Validate Request
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body

    if(!fromAccount || !toAccount || amount === undefined || !idempotencyKey) {
        return res.status(400).json({
            message: 'fromAccount, toAccount, amount, and idempotencyKey are required'
        })
    }

    if(typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            message: 'Amount must be a positive number'
        })
    }

    if(fromAccount === toAccount) {
        return res.status(400).json({
            message: 'Source and destination accounts must be different'
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
        user: req.user._id
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount) {
        return res.status(403).json({
            message: 'You can only transfer funds from your own account'
        })
    }

    if(!toUserAccount) {
        return res.status(400).json({
            message: 'Invalid destination account'
        })
    }

    // 2.Validate Idempotency Key
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === 'COMPLETED'){
            return res.status(200).json({
                message: 'Transaction already proceeded',
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === 'PENDING'){
            return res.status(200).json({
                message: 'Transaction in process..'
            })
        }

        if(isTransactionAlreadyExists.status === 'FAILED'){
            return res.status(200).json({
                message: 'Transaction failed!'
            })
        }

        if(isTransactionAlreadyExists.status === 'REVERSED'){
            return res.status(200).json({
                message: 'Transaction was reversed'
            })
        }
    }

    // 3.Check Account Status

    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE'){
        return res.status(400).json({
                message: 'Both accounts must be active to process transaction'
            })
    }

    // 4.Derive sender balance from ledger

    const balance = await fromUserAccount.getBalance()

    // The system account issues funds and is intentionally allowed to carry a
    // negative balance. Customer accounts cannot be overdrawn.
    if(!req.user.systemUser && balance < amount){
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }
    
    let transaction;

    try{

    // 5.Create Transaction [PENDING]
    const session = await mongoose.startSession()
    session.startTransaction()

    const [transaction] = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: 'PENDING'
    }], { session })

    await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: 'DEBIT'
    }], {session})

    await (() => {
        return new Promise((resolve) => setTimeout(resolve, 15 * 1000))
    })()

    await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: 'CREDIT'
    }], {session})

    await transactionModel.findOneAndUpdate(
        { _id: transaction._id},
        { status: 'COMPLETED'},
        { session }
    )

    await session.commitTransaction()
    session.endSession()

    }catch(error){
        await transactionModel.findOneAndUpdate(
            {idempotencyKey: idempotencyKey},
            {status: 'FAILED'}
        )
        return res.status(400).json({
            message: 'Transaction is Pending due to some issue, Please retry after some time'
        })
    }
    // 10.Send Trasaction Notification
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
    
    return res.status(201).json({
        message: 'Transaction completed successfully',
        transaction
    })
}

async function createInitialFundsTransaction(req, res){
    const { toAccount, amount, idempotencyKey} = req.body

    if(!toAccount || amount === undefined || !idempotencyKey) {
        return res.status(400).json({
            message: 'toAccount, amount, and idempotencyKey are required'
        })
    }

    if(typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            message: 'Amount must be a positive number'
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!toUserAccount) {
        return res.status(400).json({
            message: 'Invalid Account'
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if(!fromUserAccount) {
        return res.status(400).json({
            message: 'System user account not found!'
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const [transaction] = await transactionModel.create([{
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: 'PENDING'
    }], {session})

    await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: 'DEBIT'
    }], {session})

    await ledgerModel.create([{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: 'CREDIT'
    }], { session })

    transaction.status = 'COMPLETED'
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: 'Initial funds transaction completed successfully',
        transaction
    })
}


module.exports = { createTransaction, createInitialFundsTransaction }
