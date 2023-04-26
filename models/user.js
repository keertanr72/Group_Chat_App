const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb

class User {
    constructor(userName, email, phoneNumber, password) {
        this.userName = userName
        this.email = email
        this.phoneNumber = phoneNumber
        this.password = password
    }

    save() {
        const db = getDb()
        return db.collection('users')
            .insertOne(this)
            .then((result) => {
                // console.log(result)
            }).catch((err) => {
                console.log(err)
            });
    }

    static fetchAllExceptSelf(userId) {
        const db = getDb()
        return db
            .collection('users')
            .find({ _id: { $ne: new ObjectId(userId) } })
            .toArray()
            .then(users => {
                // console.log(users)
                return users
            })
            .catch(err => {
                console.log(err)
            })
    }

    static findByEmail(email) {
        const db = getDb()
        return db
            .collection('users')
            .find({ email })
            .toArray()
            .then((result) => {
                // console.log(result)
                return result
            }).catch((err) => {
                console.log(err)
            });
    }

    static updatePassword(password, _id) {
        const db = getDb();
        return db.collection('users')
            .updateOne({ _id: new ObjectId(_id) }, { $set: { password } })
            .then(result => {
                console.log(result, _id, password, 'woehfoiehniew.............................fpewijfewipj');
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User