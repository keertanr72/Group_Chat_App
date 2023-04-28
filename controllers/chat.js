const { ObjectId } = require('mongodb');

const OneToOneChat = require('../models/oneToOneChat')
const User = require('../models/user')
const Group = require('../models/group')

// const Group = require('../models/group')
// const UserGroup = require('../models/userGroup')
// const GroupChat = require('../models/groupChat')

exports.createChat = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const message = req.body.sentMessage
        const timeInMs = req.body.timeInMs
        const timeString = req.body.timeString
        const chat = new OneToOneChat(
            receiverId,
            message,
            timeInMs,
            timeString,
            req.user[0]._id
        )
        await chat.save()
        res.json({ success: true, userId: req.user[0]._id, chat })
    } catch (error) {
        console.log(error)
    }
}

exports.createLinkChat = async (req, res) => {
    try {
        const selectedUserNames = req.body.selectedUserNames
        const message = req.body.sentMessage
        const timeInMs = req.body.timeInMs
        const timeString = req.body.timeString

        const users = await User.findByUserNames(selectedUserNames)
        users.forEach(async (user) => {
            const userChat = new OneToOneChat(user._id, `${message}&currentTextingPerson=${user._id}`, timeInMs, timeString, req.user[0]._id)
            await userChat.save()
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

exports.createGroupChat = async (req, res) => {
    try {
        const groupId = req.query.groupId
        const message = req.body.sentMessage
        const timeInMs = req.body.timeInMs
        const timeString = req.body.timeString
        console.log(groupId)
        const chat = await Group.createChat(groupId, {
            message,
            timeInMs,
            timeString,
            userName: req.user[0].userName,
            userId: new ObjectId(req.user[0]._id),
            groupId: new ObjectId(groupId)
        })
        const userName = await User.findById(req.user[0]._id)
        console.log(userName[0].userName)
        res.json({ success: true, chat, userName: userName[0].userName })
    } catch (error) {
        console.log(error)
    }
}

exports.loadPreviousChats = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const chats = await OneToOneChat.getPreviousChats(receiverId, req.user[0]._id)
        res.json({ chats, userId: req.user[0]._id })
    } catch (error) {
        console.log(error);
    }

}

// exports.loadLiveReceiverMessages = async (req, res) => {
//     try {
//         const receiverId = req.query.receiverId
//         const timeInMs = req.query.timeInMs
//         const receiverData = await User.findByPk(receiverId)
//         const chats = await OneToOneChat.findAll(
//             {
//                 where: {
//                     [Op.and]: [
//                         { receiverId: req.user.id },
//                         { userId: receiverData.id },
//                         { timeInMs: { [Op.gt]: timeInMs } }
//                     ]
//                 },
//                 order: [['timeInMs', 'ASC']]
//             })
//         res.json({ chats, userId: req.user.id })
//     } catch (error) {
//         console.log(error)
//     }
// }

