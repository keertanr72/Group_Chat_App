const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const UserGroup = sequelize.define('userGroup', {
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = UserGroup