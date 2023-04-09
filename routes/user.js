const express = require('express')

const userController = require('../controllers/user')

const router = express.Router()

router.post('/create', userController.checkUser ,userController.createUser)

module.exports = router