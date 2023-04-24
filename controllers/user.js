const { Op } = require('sequelize');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const UserGroup = require('../models/userGroup')

const { send } = require('process')

// geting users for frontend

exports.getUsersExceptSelf = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                userName: {
                    [Op.notIn]: [req.user.userName]
                }
            }
        })
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

// getting users to add to group

exports.getNewUsersExceptSelf = async (req, res) => {
    try {
        const presentUserIds = []
        const groupId = req.query.groupId
        const presentUsers = await UserGroup.findAll({ where: { groupId }, attributes: ['userId'] })
        presentUsers.forEach(user => {
            presentUserIds.push(user.userId)
        });

        const users = await User.findAll({
            where: {
                userName: {
                    [Op.notIn]: [req.user.userName]
                },
                id: {
                    [Op.notIn]: presentUserIds
                }
            }
        })
        res.json({ users })
    } catch (error) {
        console.log(error)
    }
}

// checking if email exists

exports.checkUser = async (req, res, next) => {
    try {
        const email = req.body.email
        const userDetails = await User.findOne({ where: { email }, attributes: ['email'] })
        if (userDetails) {
            res.status(404).send({ message: 'user exists', success: false })
        }
        else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

exports.createUser = async (req, res) => {
    try {
        const { userName, email, phoneNumber, password } = req.body
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, async (error, hash) => {
            if (error) {
                console.error('Error hashing password:', error);
            } else {
                await User.create({
                    userName,
                    email,
                    phoneNumber,
                    password: hash
                })
            }
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }
}

const generateToken = (userDetails) => {
    return jwt.sign({ userDetails }, 'secretKey')
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const userDetails = await User.findOne({ where: { email } })
        if (!userDetails) {
            res.status(403).send({ message: "user doesn't exists", success: false })
        } else {
            bcrypt.compare(password, userDetails.password, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result)
                        res.status(200).send({ message: "user exists", success: true, token: generateToken(userDetails) })
                    else
                        res.status(404).send({ message: "wrong password", success: false })
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}

// checking if user is admin to display admin buttons in frontend

exports.checkAdminStatus = async (req, res) => {
    const userData = await UserGroup.findOne({
        where: {
            userId: req.user.id,
            groupId: parseInt(req.query.currentTextingPerson)
        },
        attributes: ['isAdmin']
    })
    res.json({ userData })
}