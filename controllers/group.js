const { Op } = require("sequelize");
const sequelize = require('../util/database')

const Group = require('../models/group')
const UserGroup = require('../models/userGroup')
const User = require('../models/user')
const GroupChat = require('../models/groupChat')

exports.createGroup = async (req, res) => {
    try {
        const transaction = await sequelize.transaction()
        const groupName = req.body.groupName
        const selectedUserNames = req.body.selectedUserNames
        const createdBy = req.user.userName
        const groupData = await Group.create({
            groupName,
            createdBy
        })
        const UserDetails = await User.findAll({
            where: {
                userName: {
                    [Op.in]: selectedUserNames
                }
            }
        })
        for (let user of UserDetails) {
            await UserGroup.create({
                userId: user.id,
                groupId: groupData.id,
                isAdmin: false
            }, { transaction })
        }

        await UserGroup.create({
            userId: req.user.id,
            groupId: groupData.id,
            isAdmin: true
        }, { transaction })
        await transaction.commit()
        res.json({ groupName, createdBy })
    } catch (error) {
        await transaction.rollback()
        console.log(error)
    }
}

exports.getGroups = async (req, res) => {
    const currentUserId = req.user.id
    const groups = []
    const groupData = await UserGroup.findAll({ where: { userId: currentUserId }, attributes: ['groupId'] })
    for (let group of groupData) {
        const data = await Group.findByPk(group.groupId)
        groups.push(data)
    }
    res.json({ groups, success: true })
}

exports.loadPreviousGroupChats = async (req, res) => {
    try {
        const groupId = req.query.groupId
        const chats = await GroupChat.findAll({
            where: { groupId },
            order: [['timeInMs', 'ASC']],
            include: [{
                model: User,
                attributes: ['userName']
            }]
        })
        res.json({ chats, userId: req.user.id })
    } catch (error) {
        console.log(error)
    }
}

exports.loadLiveGroupMessages = async (req, res) => {
    try {
        const groupId = req.query.groupId
        const timeInMs = req.query.timeInMs
        const chats = await GroupChat.findAll(
            {
                where: {
                    [Op.and]: [
                        { groupId },
                        { timeInMs: { [Op.gt]: timeInMs } }
                    ]
                },
                order: [['timeInMs', 'ASC']],
                include: [{
                    model: User,
                    attributes: ['userName']
                }]
            })
        res.json({ chats, userId: req.user.id })
    } catch (error) {
        console.log(error)
    }
}