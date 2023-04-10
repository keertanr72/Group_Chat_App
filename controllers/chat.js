const { Op } = require('sequelize');

const OneToOneChat = require('../models/oneToOneChat')
const User = require('../models/user')

exports.createChat = async (req, res) => {
    try {
        const receiverName = req.body.currentTextingPerson
        const message = req.body.sentMessage
        const timeInMs = req.body.timeInMs
        const timeString = req.body.timeString
        const receiverData = await User.findOne({ where: { userName: receiverName } })
        await OneToOneChat.create({
            receiverId: receiverData.id,
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

exports.loadPreviousChats = async (req, res) => {
    const receiverName = req.query.receiverName
    const receiverData = await User.findOne({ where: { userName: receiverName } })
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
}

