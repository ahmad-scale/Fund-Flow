const { Router } = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const transactionController = require('../controllers/transaction.controller')

const transactionRoutes = Router()

//POST [/api/transactions] [new transaction]
transactionRoutes.post('/', authMiddleware.authMiddleware, transactionController.createTransaction)

//POST [api/transactions/system/initial-funds] [Creates intial funds transaction from system user]
transactionRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

transactionRoutes.get('/', authMiddleware.authMiddleware, transactionController.getTransactions)

transactionRoutes.get('/ledger/:accountId', authMiddleware.authMiddleware, transactionController.getAccountLedger)

transactionRoutes.get('/:id', authMiddleware.authMiddleware, transactionController.getTransactionById)

module.exports = transactionRoutes