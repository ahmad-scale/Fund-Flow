const mongoose = require('mongoose')

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required to blacklist'],
        unique: [true, 'Token already blacklisted']
    }
}, {
    timestamps: true
})

tokenBlacklistSchema.index({ createdAt: 1 } , { expireAfterSeconds: 3600 * 24 * 7 }) // Expire after 7 days

const tokenBlackListModel = mongoose.model('TokenBlackList', tokenBlacklistSchema)

module.exports = tokenBlackListModel