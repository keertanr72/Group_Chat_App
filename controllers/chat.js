const { ObjectId } = require('mongodb');

const OneToOneChat = require('../models/oneToOneChat')
const User = require('../models/user')
const Group = require('../models/group')

exports.createChat = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const message = req.body.sentMessage
        const timeInMs = req.body.timeInMs
        const timeString = req.body.timeString
        const chat = new OneToOneChat({
            receiverId,
            message,
            timeInMs,
            timeString,
            userId: req.user._id
        })
        await chat.save()
        res.json({ success: true, userId: req.user._id, chat })
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

        const users = await User.find({ userName: { $in: selectedUserNames } })

        users.forEach(async (user) => {
            const userChat = new OneToOneChat({
                receiverId: user._id,
                message: `${message}&currentTextingPerson=${user._id}`,
                timeInMs,
                timeString,
                userId: req.user._id
            })
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
        const chat = await Group.findByIdAndUpdate(groupId,
            {
                $push: {
                    messages: {
                        message,
                        timeInMs,
                        timeString,
                        userName: req.user.userName,
                        userId: new ObjectId(req.user._id),
                        groupId: new ObjectId(groupId)
                    }
                }
            }, { new: true })
        const userName = await User.findById(req.user._id)
        res.json({ success: true, chat: chat.messages[chat.messages.length - 1], userName: userName.userName })
    } catch (error) {
        console.log(error)
    }
}

exports.loadPreviousChats = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const chats = await OneToOneChat.find({
            $or: [
                { receiverId, userId: req.user._id },
                { receiverId: req.user._id, userId: receiverId }
            ]
        })
        res.json({ chats, userId: req.user._id })
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

