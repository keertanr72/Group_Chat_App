const { default: mongoose } = require('mongoose')

const Schema = require('mongoose').Schema

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)


// userSchema.statics.findByEmail = function(email) {
//     return this.findOne({ email });
//   };

// const { ObjectId } = require('mongodb');

// const getDb = require('../util/database').getDb

// class User {
//     constructor(userName, email, phoneNumber, password) {
//         this.userName = userName
//         this.email = email
//         this.phoneNumber = phoneNumber
//         this.password = password
//     }

//     save() {
//         const db = getDb()
//         return db.collection('users')
//             .insertOne(this)
//             .then((result) => {
//                 // console.log(result)
//             }).catch((err) => {
//                 console.log(err)
//             });
//     }

//     static getNewUsers(userIds) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({ _id: { $nin: userIds } })
//             .toArray()
//             .then(users => {
//                 // console.log(users)
//                 return users
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static getUsersById(userIds) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({ _id: { $in: userIds } })
//             .toArray()
//             .then(users => {
//                 // console.log(users)
//                 return users
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static fetchAllExceptSelf(userId) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({ _id: { $ne: new ObjectId(userId) } })
//             .toArray()
//             .then(users => {
//                 // console.log(users)
//                 return users
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static findById(userId) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({ _id: new ObjectId(userId) })
//             .toArray()
//             .then((result) => {
//                 // console.log(result)
//                 return result
//             }).catch((err) => {
//                 console.log(err)
//             });
//     }

//     static findByUserNames(userName) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({ userName: { $in: userName } })
//             .toArray()
//             .then((result) => {
//                 // console.log(result)
//                 return result
//             }).catch((err) => {
//                 console.log(err)
//             });
//     }

//     static findByEmail(email) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .find({ email })
//             .toArray()
//             .then((result) => {
//                 // console.log(result)
//                 return result
//             }).catch((err) => {
//                 console.log(err)
//             });
//     }

//     static updatePassword(password, _id) {
//         const db = getDb();
//         return db.collection('users')
//             .updateOne({ _id: new ObjectId(_id) }, { $set: { password } })
//             .then(result => {
//                 // console.log(result, _id, password);
//                 return result;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = User