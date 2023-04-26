const express = require('express')

const userController = require('../controllers/user')
const userAuthenticationController = require('../controllers/userAuthentication')

const router = express.Router()

router.get('/get-users', userAuthenticationController.userAuthentication, userController.getUsersExceptSelf)

// router.get('/check-admin-status', userAuthenticationController.userAuthentication, userController.checkAdminStatus)

// router.get('/get-new-users', userAuthenticationController.userAuthentication, userController.getNewUsersExceptSelf)

router.post('/create', userController.checkUser, userController.createUser)

router.post('/login', userController.userLogin)

module.exports = router