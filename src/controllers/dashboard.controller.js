const accountModel = require('../models/account.model')
const transactionModel = require('../models/transaction.model')

async function getDashboard(req, res) {
    const accounts = await accountModel.find({
        user: req.user._id
    })

    const accountIds = accounts.map(acc => acc._id)

    let totalBalance = 0

    for (const account of accounts) {
        totalBalance += await account.getBalance()
    }

    const recentTransactions = await transactionModel
        .find({
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(10)

    res.status(200).json({
        totalAccounts: accounts.length,
        totalBalance,
        recentTransactions
    })
}

module.exports = {
    getDashboard
}