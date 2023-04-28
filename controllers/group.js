const { ObjectId } = require('mongodb');

const Group = require('../models/group')
const User = require('../models/user')

// to get all users in group for checkbox

exports.getGroupUsersExceptSelf = async (req, res) => {
    try {
        const presentUsers = await Group.getUsersInGroup(req.query.groupId)
        const presentUserIdsExceptSelf = presentUsers.filter(element => element.toString() !== req.user[0]._id)
        const users = await User.getUsersById(presentUserIdsExceptSelf)
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

//get all non admins for checkbox

exports.getGroupNonAdmins = async (req, res) => {
    try {
        const presentUsersInGroup = await Group.getUsersInGroup(req.query.groupId)
        const presentAdminsInGroup = await Group.getAdminsInGroup(req.query.groupId)
        const presentUsersInGroup1 = presentUsersInGroup.map(element => element.toString())
        const presentAdminsInGroup1 = presentAdminsInGroup.map(element => element.toString())
        const nonAdmins = presentUsersInGroup1.filter(element => {
            return !presentAdminsInGroup1.includes(element)
        })
        const nonAdmins1 = nonAdmins.map(element => new ObjectId(element))
        const users = await User.getUsersById(nonAdmins1)
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName
        const selectedUserNames = req.body.selectedUserNames
        const createdBy = req.user[0].userName

        const UserDetails = await User.findByUserNames(selectedUserNames)

        const userIds = UserDetails.map(element => {
            return element._id
        })

        userIds.push(new ObjectId(req.user[0]._id))

        const groupData = new Group(
            groupName,
            createdBy,
            [new ObjectId(req.user[0]._id)],
            userIds
        )

        await groupData.save()

        res.json({ groupName, createdBy })
    } catch (error) {
        console.log(error)
    }
}

// to load to frontend

exports.getGroups = async (req, res) => {
    const currentUserId = req.user[0]._id
    const groups = await Group.getUsersGroups(currentUserId)
    res.json({ groups, success: true })
}

exports.loadPreviousGroupChats = async (req, res) => {
    try {
        const groupId = req.query.groupId
        const chats = await Group.getPreviousMessages(groupId)
        res.json({ chats, userId: req.user[0]._id })
    } catch (error) {
        console.log(error)
    }
}

// exports.loadLiveGroupMessages = async (req, res) => {
//     try {
//         const groupId = req.query.groupId
//         const timeInMs = req.query.timeInMs
//         const chats = await GroupChat.findAll(
//             {
//                 where: {
//                     [Op.and]: [
//                         { groupId },
//                         { timeInMs: { [Op.gt]: timeInMs } }
//                     ]
//                 },
//                 order: [['timeInMs', 'ASC']],
//                 include: [{
//                     model: User,
//                     attributes: ['userName']
//                 }]
//             })
//         res.json({ chats, userId: req.user.id })
//     } catch (error) {
//         console.log(error)
//     }
// }

// adding members to group

exports.addMembers = async (req, res) => {
    try {
        const selectedUserNames = req.body.selectedUserNames
        const groupId = req.query.groupId
        const users = await User.findByUserNames(selectedUserNames)
        const userIds = users.map(user => user._id)
        await Group.addUsersToGroup(groupId ,userIds)
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

// removing a member from group

exports.deleteMembers = async (req, res) => {
    try {
        let selectedUserNames = req.query.selectedUserNames
        selectedUserNames = selectedUserNames.split(',')
        const groupId = req.query.groupId
        const users = await User.findByUserNames(selectedUserNames)
        const userIds = users.map(user => user._id)
        await Group.deleteUsersFromGroup(groupId ,userIds)
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

// making new admins

exports.makeAdmin = async (req, res) => {
    try {
        let selectedUserNames = req.body.selectedUserNames
        const groupId = req.query.groupId
        const users = await User.findByUserNames(selectedUserNames)
        const userIds = users.map(user => user._id)
        await Group.makeUsersAdmin(groupId ,userIds)
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

exports.inviteLinkClick = async (req, res) => {
    try {
        const groupId = req.query.groupId
        await Group.addUsersToGroup(groupId ,[new ObjectId(req.query.currentTextingPerson)])
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}