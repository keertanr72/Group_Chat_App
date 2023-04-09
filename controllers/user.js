const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { send } = require('process')

exports.checkUser = async (req, res, next) => {
    try {
        const email = req.body.email
        const userEmail = await User.findOne({ where: { email }, attributes: ['email'] })
        if (userEmail) {
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
        res.send({ status: 'success' })
    } catch (error) {
        console.log(error)
    }
}

const generateToken = (id) => {
    return jwt.sign({ userId: id }, 'secretKey')
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log('eeeeeeeemail', req.body.email, password)
        const userEmail = await User.findOne({ where: { email }, attributes: ['password', 'id'] })
        if (!userEmail) {
            res.status(403).send({ message: "user doesn't exists", success: false })
        } else {
            bcrypt.compare(password, userEmail.password, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result)
                        res.status(200).send({ message: "user exists", success: true, token: generateToken(userEmail.id) })
                    else
                        res.status(404).send({ message: "wrong password", success: false })
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}