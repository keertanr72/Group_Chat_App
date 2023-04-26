const OneToOneChat = require('../models/oneToOneChat')
const User = require('../models/user')

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

// exports.createLinkChat = async (req, res) => {
//     try {
//         const selectedUserNames = req.body.selectedUserNames
//         const message = req.body.sentMessage
//         const timeInMs = req.body.timeInMs
//         const timeString = req.body.timeString

//         const users = await User.findAll({
//             attributes: ['id'],
//             where: {
//                 userName: {
//                     [Op.in]: selectedUserNames
//                 }
//             }
//         });
//         console.log(users)
//         const dataToCreate = users.map(user => {
//             const data = {
//                 receiverId: req.user.id,
//                 message: message + `&currentTextingPerson=${user.id}`,
//                 timeInMs,
//                 timeString,
//                 userId: user.id
//             }
//             return data
//         });
//         console.log(dataToCreate)
//         await OneToOneChat.bulkCreate(dataToCreate)
//         res.json({ success: true })
//     } catch (error) {
//         console.log(error)
//     }
// }

// exports.createGroupChat = async (req, res) => {
//     try {
//         const groupId = req.query.groupId
//         const message = req.body.sentMessage
//         const timeInMs = req.body.timeInMs
//         const timeString = req.body.timeString
//         const chat = await GroupChat.create({
//             message,
//             timeInMs,
//             timeString,
//             userId: req.user.id,
//             groupId
//         })
//         const userName = await User.findByPk(req.user.id, {
//             attributes: ['userName']
//         })
//         res.json({ success: true, chat, userName })
//     } catch (error) {
//         console.log(error)
//     }
// }

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

