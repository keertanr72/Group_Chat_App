const { Op } = require('sequelize');

const OneToOneChat = require('../models/oneToOneChat')
const User = require('../models/user')

const Group = require('../models/group')
const UserGroup = require('../models/userGroup')
const GroupChat = require('../models/groupChat')

exports.createChat = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const message = req.body.sentMessage
        const timeInMs = req.body.timeInMs
        const timeString = req.body.timeString
        await OneToOneChat.create({
            receiverId,
            message,
            timeInMs,
            timeString,
            userId: req.user.id
        })
        res.json({ success: true })
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

        const users = await User.findAll({
            attributes: ['id'],
            where: {
                userName: {
                    [Op.in]: selectedUserNames
                }
            }
        });
        console.log(users)
        const dataToCreate = users.map(user => {
            const data = {
                receiverId: user.id,
                message: message + `&currentTextingPerson=${user.id}`,
                timeInMs,
                timeString,
                userId: req.user.id
            }
            return data
        });
        console.log(dataToCreate)
        await OneToOneChat.bulkCreate(dataToCreate)
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
        await GroupChat.create({
            message,
            timeInMs,
            timeString,
            userId: req.user.id,
            groupId
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

exports.loadPreviousChats = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const receiverData = await User.findByPk(receiverId)
        const chats = await OneToOneChat.findAll(
            {
                where: {
                    [Op.or]: [
                        {
                            [Op.and]: [
                                { receiverId: receiverData.id },
                                { userId: req.user.id }
                            ]
                        },
                        {
                            [Op.and]: [
                                { receiverId: req.user.id },
                                { userId: receiverData.id }
                            ]
                        }
                    ]
                },
                order: [['timeInMs', 'ASC']]
            })
        res.json({ chats, userId: req.user.id })
    } catch (error) {
        console.log(error);
    }

}

exports.loadLiveReceiverMessages = async (req, res) => {
    try {
        const receiverId = req.query.receiverId
        const timeInMs = req.query.timeInMs
        const receiverData = await User.findByPk(receiverId)
        const chats = await OneToOneChat.findAll(
            {
                where: {
                    [Op.and]: [
                        { receiverId: req.user.id },
                        { userId: receiverData.id },
                        { timeInMs: { [Op.gt]: timeInMs } }
                    ]
                },
                order: [['timeInMs', 'ASC']]
            })
        res.json({ chats, userId: req.user.id })
    } catch (error) {
        console.log(error)
    }
}

