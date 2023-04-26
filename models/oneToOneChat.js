const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb


class OneToOneChat {
    constructor(receiverId, message, timeInMs, timeString, userId) {
        this.receiverId = receiverId
        this.message = message
        this.timeInMs = timeInMs
        this.timeString = timeString
        this.userId = userId
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
                        receiverId: receiverId,
                        userId: loggedUserID
                    },
                    {
                        receiverId: loggedUserID,
                        userId: receiverId
                    }
                ]
            })
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