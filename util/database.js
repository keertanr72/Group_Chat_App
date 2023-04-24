const MongoClient = require('mongodb').MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://keertan:keertan@cluster0.9m5vdch.mongodb.net/groupchatapp?retryWrites=true&w=majority')
    .then(client => {
      console.log('connected')
      _db = client.db()
      callback(client)
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

const getDb = () => {
  if(_db)
    return _db
  throw 'db not found'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb