const express = require('express')

const userAuthenticationController = require('../controllers/userAuthentication')
const chatController = require('../controllers/chat')

const router = express.Router()

router.post('/create', userAuthenticationController.userAuthentication, chatController.createChat)

router.get('/load-previous-chats', userAuthenticationController.userAuthentication, chatController.loadPreviousChats)

module.exports = router