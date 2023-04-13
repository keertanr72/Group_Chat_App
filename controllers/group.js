const { Op } = require("sequelize");
const sequelize = require('../util/database')

const Group = require('../models/group')
const UserGroup = require('../models/userGroup')
const User = require('../models/user')
const GroupChat = require('../models/groupChat')

exports.getGroupUsersExceptSelf = async (req, res) => {
    try {
        const users = await UserGroup.findAll({
            where: {
                userId: {
                    [Op.notIn]: [req.user.id]
                },
                groupId: {
                    [Op.in]: [parseInt(req.query.groupId)]
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['userName']
                }
            ]
        })
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

exports.getGroupNonAdmins = async (req, res) => {
    try {
        const users = await UserGroup.findAll({
            where: {
                userId: {
                    [Op.notIn]: [req.user.id]
                },
                groupId: {
                    [Op.in]: [parseInt(req.query.groupId)]
                },
                isAdmin: false
            },
            include: [
                {
                    model: User,
                    attributes: ['userName']
                }
            ]
        })
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

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

exports.addMembers = async (req, res) => {
    try {
        const selectedUserNames = req.body.selectedUserNames
        const groupId = req.query.groupId
        const users = await User.findAll({
            attributes: ['id'],
            where: {
                userName: {
                    [Op.in]: selectedUserNames
                }
            }
        })

        const dataForCreating = users.map((user) => {
            const data = {
                isAdmin: false,
                userId: user.id,
                groupId: parseInt(groupId)
            }
            return data
        })
        console.log(dataForCreating)
        await UserGroup.bulkCreate(dataForCreating)
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

exports.deleteMembers = async (req, res) => {
    try {
        let selectedUserNames = req.query.selectedUserNames
        selectedUserNames = selectedUserNames.split(',')
        const groupId = req.query.groupId
        const users = await User.findAll({
            attributes: ['id'],
            where: {
                userName: {
                    [Op.in]: selectedUserNames
                }
            }
        })

        const userIds = users.map(user => user.id)
        // console.log(dataForDeleting)
        await UserGroup.destroy({
            where: {
                [Op.and]: [
                    { userId: userIds },
                    { groupId }
                ]
            }
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        let selectedUserNames = req.body.selectedUserNames
        const groupId = req.query.groupId
        const users = await User.findAll({
            attributes: ['id'],
            where: {
                userName: {
                    [Op.in]: selectedUserNames
                }
            }
        })

        const userIds = users.map(user => user.id)
        // console.log(dataForDeleting)
        await UserGroup.update({isAdmin: true}, {
            where: {
                [Op.and]: [
                    { userId: userIds },
                    { groupId }
                ]
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
        await UserGroup.create({
            isAdmin: false,
            userId: parseInt(req.query.currentTextingPerson),
            groupId: parseInt(groupId)
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}