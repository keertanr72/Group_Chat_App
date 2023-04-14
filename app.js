const express = require('express')

const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const UserRoute = require('./routes/user')
const forgotPasswordRoute = require('./routes/forgotPassword')
const chatRoute = require('./routes/chat')
const groupRoute = require('./routes/group')

const errorController = require('./controllers/error')

const sequelize = require('./util/database')

const User = require('./models/user')
const ForgotPassword = require('./models/forgotPassword')
const OneToOneChat = require('./models/oneToOneChat')
const Group = require('./models/group')
const GroupChat = require('./models/groupChat')
const UserGroup = require('./models/userGroup')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

const app = express()

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))
app.use(helmet())
app.use(compression())
// app.use(morgan(`combined`, { stream: accessLogStream }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/user', UserRoute)

app.use('/password',forgotPasswordRoute)

app.use('/chat', chatRoute)

app.use('/group', groupRoute)

app.use(errorController.sendError)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)

User.hasMany(OneToOneChat)
OneToOneChat.belongsTo(User)

User.hasMany(GroupChat)
GroupChat.belongsTo(User)

User.belongsToMany(Group, { through: UserGroup })
Group.belongsToMany(User, { through: UserGroup })

Group.hasMany(GroupChat)
GroupChat.belongsTo(Group)

User.hasMany(UserGroup)
UserGroup.belongsTo(User)

sequelize
.sync()
// .sync({force: true})
.then(() => {
    app.listen(3000)
})
