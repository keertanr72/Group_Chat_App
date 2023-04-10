const OneToOneChat = require('../models/oneToOneChat')
const User = require('../models/user')

exports.createChat = async (req, res) => {
    try {
        const receiverName = req.body.currentTextingPerson
        const message = req.body.sentMessage
        const receiverData = await User.findOne({ where: { userName: receiverName } })
        await OneToOneChat.create({
            receiverId: receiverData.id,
            message,
            userId: req.user.id
        })
        res.json({ success: true })
    } catch (error) {
        console.log(error)
    }

}