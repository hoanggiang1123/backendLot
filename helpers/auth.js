const jwt = require('express-jwt')
const user = require('../schemas/user')

const User = require('../schemas/user')
exports.checkLogin = jwt(
    { secret: process.env.JWT_SECRET, algorithms: ['HS256'] }
)
exports.requireAdmin = (req, res, next) => {
    User.findOne({ _id: req.user._id }).exec((err, user) => {
        if (user && !err) {
            if (user.role === 1) {
                next()
            } else {
                return res.status(400).json({
                    status: 0,
                    msg: 'Not Authorized'
                })
            }
        } else {
            return res.status(400).json({
                status: 0,
                msg: 'Not Authorized'
            })
        }
    })
}