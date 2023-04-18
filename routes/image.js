const express = require('express')

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const userAuthenticationController = require('../controllers/userAuthentication')
const imageController = require('../controllers/image')

const router = express()

router.post('/', upload.single('selectedFile'), userAuthenticationController.userAuthentication, imageController.postToS3)

// router.post('/', upload.single('selectedFile'), imageController.postToS3)

router.get('/:key', imageController.getFromS3)

module.exports = router