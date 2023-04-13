const express = require('express')

const groupController = require('../controllers/group')
const userAuthenticationController = require('../controllers/userAuthentication')

const router = express.Router()

router.post('/create', userAuthenticationController.userAuthentication, groupController.createGroup)

router.get('/get-groups', userAuthenticationController.userAuthentication, groupController.getGroups)

router.get('/get-group-users', userAuthenticationController.userAuthentication, groupController.getGroupUsersExceptSelf)

router.get('/get-group-non-admins', userAuthenticationController.userAuthentication, groupController.getGroupNonAdmins)

router.get('/load-previous-group-chats', userAuthenticationController.userAuthentication, groupController.loadPreviousGroupChats)

router.put('/add-members', userAuthenticationController.userAuthentication, groupController.addMembers)

router.delete('/delete-members', userAuthenticationController.userAuthentication, groupController.deleteMembers)

router.put('/make-admin', userAuthenticationController.userAuthentication, groupController.makeAdmin)

router.get('/invite-link-click', groupController.inviteLinkClick)

router.get('/load-live-group-messages', userAuthenticationController.userAuthentication, groupController.loadLiveGroupMessages)

module.exports = router