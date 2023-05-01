const { uploadFile, getFileStream } = require('./s3')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const OneToOneChat = require('../models/oneToOneChat')
const Group = require('../models/group')

exports.getFromS3 = (req, res) => {
    console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)
    res.setHeader('Content-Type', 'image/png')
    readStream.pipe(res)
}

exports.postToS3 = async (req, res) => {
    try {
        const result = await uploadFile(req.file)
        await unlinkFile(req.file.path)

        if (req.query.groupId) {
            const groupId = req.query.groupId
            const message = `http://localhost:3000/image/${result.Key}`
            const timeInMs = req.query.timeInMs
            const timeString = req.query.timeString
            const chat = await Group.findByIdAndUpdate(groupId, {
                $push: {
                    messages: {
                        message,
                        timeInMs,
                        timeString,
                        userName: req.user.userName,
                        userId: req.user._id,
                        groupId
                    }
                }
            })
        } else {
            const receiverId = req.query.receiverId
            const message = `http://localhost:3000/image/${result.Key}`
            const timeInMs = req.query.timeInMs
            const timeString = req.query.timeString
            const chat = new OneToOneChat({
                receiverId,
                message,
                timeInMs,
                timeString,
                userId: req.user._id
            })
            chat.save()
        }
        res.json({ imagePath: `http://localhost:3000/image/${result.Key}` })
    } catch (error) {
        console.log(error)
    }
}