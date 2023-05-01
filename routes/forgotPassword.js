const express = require('express')

const forgotPasswordController = require('../controllers/forgotPassword')

const router = express()

router.post('/forgot-password', forgotPasswordController.forgotPassword)

router.get('/forgot-password/:id', forgotPasswordController.getOnLinkClick)

router.patch('/update-password', forgotPasswordController.updatePassword)

module.exports = router