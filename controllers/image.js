const { uploadFile, getFileStream } = require('./s3')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const OneToOneChat = require('../models/oneToOneChat')
const GroupChat = require('../models/groupChat')

exports.getFromS3 = (req, res) => {
    console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
  }

exports.postToS3 = async (req, res) => {
    try {
        const result = await uploadFile(req.file)
        await unlinkFile(req.file.path)

        if(req.query.groupId) {
            const groupId = req.query.groupId
            const message = `http://localhost:3000/image/${result.Key}`
            const timeInMs = req.query.timeInMs
            const timeString = req.query.timeString
            const chat = await GroupChat.create({
                message,
                timeInMs,
                timeString,
                userId: req.user.id,
                groupId
            })
        } else {
            const receiverId = req.query.receiverId
            const message = `http://localhost:3000/image/${result.Key}`
            const timeInMs = req.query.timeInMs
            const timeString = req.query.timeString
            const chat = await OneToOneChat.create({
                receiverId,
                message,
                timeInMs,
                timeString,
                userId: req.user.id
            })
        }

        res.json({imagePath: `http://localhost:3000/image/${result.Key}`})
    } catch (error) {
        console.log(error)
    }
}