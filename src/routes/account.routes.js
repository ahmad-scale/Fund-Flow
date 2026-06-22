const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const accountController  = require('../controllers/account.controller')

const router = express.Router()

//POST - api/accounts/ [create a new account] [protected account]
router.post('/', authMiddleware.authMiddleware, accountController.createAccountController)

//GET - api/accounts/ [Get all accounts of the logged-in user] [Protected Route]
router.get('/', authMiddleware.authMiddleware, accountController.getUserAccountController)

//GET - api/accounts/balance/:accountId [Fetch account balance]
router.get('/balance/:accountId', authMiddleware.authMiddleware, accountController.getAccountBalanceController)

module.exports = router