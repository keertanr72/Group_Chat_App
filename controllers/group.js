const { ObjectId } = require('mongodb');

const Group = require('../models/group')
const User = require('../models/user')

// to get all users in group for checkbox

exports.getGroupUsersExceptSelf = async (req, res) => {
    try {
        const presentUsers = await Group.findOne({ _id: req.query.groupId }).select('userIds')
        const users = await User.find({
            _id: {
                $in: presentUsers.userIds,
                $ne: req.user._id
            }
        })
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

//get all non admins for checkbox

exports.getGroupNonAdmins = async (req, res) => {
    try {
        const presentUsers = await Group.findById(req.query.groupId)
        const presentUsersInGroup = presentUsers.userIds
        const presentAdminsInGroup = presentUsers.admins
        const presentUsersInGroup1 = presentUsersInGroup.map(element => element.toString())
        const presentAdminsInGroup1 = presentAdminsInGroup.map(element => element.toString())
        const nonAdmins = presentUsersInGroup1.filter(element => {
            return !presentAdminsInGroup1.includes(element)
        })
        const nonAdmins1 = nonAdmins.map(element => new ObjectId(element))
        const users = await User.find({ _id: { $in: nonAdmins1 }})
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName
        const selectedUserNames = req.body.selectedUserNames
        const createdBy = req.user.userName

        const UserDetails = await User.find({ userName: { $in: selectedUserNames } })

        const userIds = UserDetails.map(element => {
            return element._id
        })

        userIds.push(new ObjectId(req.user._id))

        const groupData = new Group({
            groupName,
            createdBy,
            admins: [new ObjectId(req.user._id)],
            userIds
        })

        await groupData.save()

        res.json({ groupName, createdBy })
    } catch (error) {
        console.log(error)
    }
}

// to load to frontend

exports.getGroups = async (req, res) => {
    const currentUserId = req.user._id
    const groups = await Group.find({ userIds: { $in: [new ObjectId(currentUserId)] } })
    res.json({ groups, success: true })
}

exports.loadPreviousGroupChats = async (req, res) => {
    try {
        const groupId = req.query.groupId
        const chats = await Group.findById(groupId)
        res.json({ chats: chats.messages, userId: req.user._id })
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
        const users = await User.find({ userName: { $in: selectedUserNames } }).select('_id')
        // const
        await Group.findByIdAndUpdate(groupId, {
            $push: {
                userIds: { $each: users }
            }
        })
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
        const users = await User.find({ userName: { $in: selectedUserNames } }).select('_id')
        await Group.findByIdAndUpdate(groupId, {
            $pullAll: {
                userIds: { $each: users }
            }
        })
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
        const users = await User.find({ userName: { $in: selectedUserNames } })
        const userIds = users.map(user => user._id)
        await Group.findByIdAndUpdate(groupId, {
            $push: {
                admins: { $each: userIds }
            }
        })

        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

exports.inviteLinkClick = async (req, res) => {
    try {
        const groupId = req.query.groupId
        await Group.updateOne({_id: new ObjectId(groupId)}, { $push: { userIds: new ObjectId(req.query.currentTextingPerson)} })
        
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}