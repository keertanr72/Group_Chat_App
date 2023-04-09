const express = require('express')

const userController = require('../controllers/user')
const forgotPasswordController = require('../controllers/forgotPassword')

const router = express()

router.post('/forgot-password', forgotPasswordController.forgotPassword)

router.patch('/update-password', forgotPasswordController.updatePassword)

router.get('/forgot-password/:id', forgotPasswordController.getOnLinkClick)

module.exports = router