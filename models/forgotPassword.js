const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const ForgotPassword = sequelize.define('forgotPassword', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
})

module.exports = ForgotPassword