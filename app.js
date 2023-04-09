const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')

const UserRoutes = require('./routes/user')
const sequelize = require('./util/database')

const app = express()

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/user', UserRoutes)

sequelize
.sync()
// .sync({force: true})
.then(() => {
    app.listen(3000)
})
