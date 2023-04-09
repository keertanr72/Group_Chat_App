const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')

const UserRoutes = require('./routes/user')
const sequelize = require('./util/database')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/user', UserRoutes)

sequelize
.sync()
// .sync({force: true})
.then(() => {
    app.listen(3000)
})
