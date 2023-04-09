const bcrypt = require('bcrypt')

const User = require('../models/user')
const { send } = require('process')

exports.checkUser = async (req, res, next) => {
    try {
        const email = req.body.email
        const userEmail = await User.findOne({ where: {email}, attributes: ['email'] })
        if(userEmail) {
            res.status(404).send({message: 'user exists', success: false})
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