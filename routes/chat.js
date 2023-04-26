const express = require('express')

const userAuthenticationController = require('../controllers/userAuthentication')
const chatController = require('../controllers/chat')

const router = express.Router()

router.post('/create', userAuthenticationController.userAuthentication, chatController.createChat)

// router.post('/create-link-chat', userAuthenticationController.userAuthentication, chatController.createLinkChat)

// router.post('/create-group-chat', userAuthenticationController.userAuthentication, chatController.createGroupChat)

router.get('/load-previous-chats', userAuthenticationController.userAuthentication, chatController.loadPreviousChats)

// router.get('/load-live-receiver-messages', userAuthenticationController.userAuthentication, chatController.loadLiveReceiverMessages)

module.exports = router