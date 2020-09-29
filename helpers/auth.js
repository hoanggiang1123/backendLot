const jwt = require('express-jwt')

exports.checkLogin = jwt(
    { secret: process.env.JWT_SECRET, algorithms: ['HS256'] }
)