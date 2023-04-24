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
                console.log(result)
            }).catch((err) => {
                console.log(err)
            });
    }
}

module.exports = User