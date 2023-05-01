const jwt = require('jsonwebtoken')

exports.userAuthentication = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        const user = jwt.verify(token, 'secretKey')
        req.user = user.userDetails
        next()
    } catch (error) {
        console.log(error)
    }
}