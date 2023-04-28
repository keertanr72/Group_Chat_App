const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb


class OneToOneChat {
    constructor(receiverId, message, timeInMs, timeString, userId) {
        this.receiverId = new ObjectId(receiverId)
        this.message = message
        this.timeInMs = timeInMs
        this.timeString = timeString
        this.userId = new ObjectId(userId)
    }

    save() {
        const db = getDb()
        return db.collection('oneToOneChats')
            .insertOne(this)
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                console.log(err)
            });
    }

    static getPreviousChats(receiverId, loggedUserID) {
        const db = getDb()
        return db.collection('oneToOneChats')
            .find({
                $or: [
                    {
                        receiverId: new ObjectId(receiverId),
                        userId: new ObjectId(loggedUserID)
                    },
                    {
                        receiverId: new ObjectId(loggedUserID),
                        userId: new ObjectId(receiverId)
                    }
                ]
            })
            .sort({ timeInMs: 1 })
            .toArray()
            .then((result) => {
                console.log(result, receiverId, loggedUserID)
                return result
            }).catch((err) => {
                console.log(err)                
            });
    }
}

module.exports = OneToOneChat