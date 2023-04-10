const express = require('express')

const bodyParser = require('body-parser')
const path = require('path')

const cors = require('cors')

const UserRoute = require('./routes/user')
const forgotPasswordRoute = require('./routes/forgotPassword')
const chatRoute = require('./routes/chat')

const errorController = require('./controllers/error')

const sequelize = require('./util/database')

const User = require('./models/user')
const ForgotPassword = require('./models/forgotPassword')
const OneToOneChat = require('./models/oneToOneChat')

const app = express()

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/user', UserRoute)

app.use('/password',forgotPasswordRoute)

app.use('/chat', chatRoute)

app.use(errorController.sendError)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)

User.hasMany(OneToOneChat)
OneToOneChat.belongsTo(User)

sequelize
.sync()
// .sync({force: true})
.then(() => {
    app.listen(3000)
})
