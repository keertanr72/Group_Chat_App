const express = require('express')

const userAuthenticationController = require('../controllers/userAuthentication')
const chatController = require('../controllers/chat')

const router = express.Router()

router.post('/create', userAuthenticationController.userAuthentication, chatController.createChat)

module.exports = router