const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb

class Group {
    constructor(groupName, createdBy, admins, usersInGroup) {
        this.groupName = groupName
        this.createdBy = createdBy
        this.admins = admins
        this.usersInGroup = usersInGroup
        this.messages = []
    }

    save() {
        const db = getDb()
        return db.collection('groups')
            .insertOne(this)
            .then((result) => {
                // console.log(result)
            }).catch((err) => {
                console.log(err)
            });
    }

    static getUsersGroups(userId) {
        const db = getDb()
        return db.collection('groups')
            .find({ usersInGroup: { $in: [new ObjectId(userId)] } })
            .toArray()
            .then((result) => {
                return result
            }).catch((err) => {
                console.log(err)
            });
    }

    static getUsersInGroup(groupId) {
        const db = getDb()
        return db.collection('groups')
            .findOne({ _id: new ObjectId(groupId) })
            .then((result) => {
                return result.usersInGroup
            }).catch((err) => {
                console.log(err)
            });
    }

    static getAdminsInGroup(groupId) {
        const db = getDb()
        return db.collection('groups')
            .findOne({ _id: new ObjectId(groupId) })
            .then((result) => {
                return result.admins
            }).catch((err) => {
                console.log(err)
            });
    }

    static createChat(groupId, obj) {
        const db = getDb()
        return db.collection('groups')
            .updateOne(
            { _id: new ObjectId(groupId) },
            { $push: { messages: obj } }
          )
            .then((result) => {
                return result
            }).catch((err) => {
                console.log(err)
            });
    }

    static getPreviousMessages(groupId) {
        const db = getDb()
        return db.collection('groups')
            .findOne({ _id: new ObjectId(groupId) })
            .then((result) => {
                const messages = result.messages.sort((a, b) => a.timeInMs - b.timeInMs)
                // console.log(messages)
                return messages
            }).catch((err) => {
                console.log(err)
            });
    }

    static checkAdmin(groupId, userId) {
        const db = getDb()
        return db.collection('groups')
            .findOne({ _id: new ObjectId(groupId), admins: new ObjectId(userId) })
            .then((result) => {
                return result
            }).catch((err) => {
                console.log(err)
            });
    }

    static addUsersToGroup(groupId, userIds) {
        const db = getDb()
        return db.collection('groups')
            .updateOne({_id: new ObjectId(groupId)}, { $push: { usersInGroup: { $each: userIds } } })
            .then((result) => {
                return result
            }).catch((err) => {
                console.log(err)
            })
    }

    static deleteUsersFromGroup(groupId, userIds) {
        const db = getDb()
        return db.collection('groups')
            .updateOne({_id: new ObjectId(groupId)}, { $pull: { usersInGroup: { $in: userIds } } })
            .then((result) => {
                return result
            }).catch((err) => {
                console.log(err)
            })
    }

    static makeUsersAdmin(groupId, userIds) {
        const db = getDb()
        return db.collection('groups')
            .updateOne({_id: new ObjectId(groupId)}, { $push: { admins: { $each: userIds } } })
            .then((result) => {
                return result
            }).catch((err) => {
                console.log(err)
            })
    }
}

module.exports = Group