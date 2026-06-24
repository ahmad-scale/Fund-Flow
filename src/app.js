const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const path = require('path')
const fs = require('fs')

const app = express()
const frontendDist = path.join(__dirname, '..', 'fundflow-frontend', 'dist')

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json())
app.use(cookieParser())

//Routes required
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')
const transactionRoutes = require('./routes/transaction.routes')
const dashboardRoutes = require('./routes/dashboard.routes')

app.get('/api/health', (req, res) => {
    res.send('Ledger Service is up and running')
})

//Use Routes
app.use('/api/auth', authRouter)
app.use('/api/accounts', accountRouter)
app.use('/api/transactions', transactionRoutes)
app.use('/api/dashboard', dashboardRoutes)

if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist))

    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) return next()

        res.sendFile(path.join(frontendDist, 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('Ledger Service is up and running')
    })
}

module.exports = app
