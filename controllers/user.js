const User = require('../schemas/user')
const jwt = require('jsonwebtoken')

const maxAge = 60 * 60 * 24 * 1000

exports.post_signup = (req, res) => {
    const { username, name, email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email already taken'
            })
        }
        let newUser = new User({ username, name, email, password });
        newUser.save((err, success) => {
            if (err && !success) {
                return res.status(400).json({
                    error: err
                })
            }
            const token = jwt.sign({ _id: success.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, { maxAge });
            const { _id, username, name, email, role, avatar } = success;
            return res.json({
                status: 1,
                token,
                user: { _id, username, name, email, role, avatar }
            })
        })
    })
}

exports.post_signin = (req, res) => {
    const { email, password } = req.body

    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Email or Password do not match'
            })
        }

        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email or Password do not match'
            })
        }

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { maxAge });
        const { _id, username, name, email, role, avatar } = user;
        return res.json({
            status: 1,
            token,
            user: { _id, username, name, email, role, avatar }
        })
    })
}

exports.get_userchecklogin = (req, res) => {
    User.findOne({ _id: req.user._id }).exec((err, user) => {
        if (err && !user) {
            return res.status(400).json({
                status: 0,
                error: 'An Error Occurr'
            })
        }
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { maxAge });
        const { _id, username, name, email, role, avatar } = user;
        return res.json({
            status: 1,
            token,
            user: { _id, username, name, email, role, avatar }
        })
    })
}

exports.get_signout = (req, res) => {
    res.clearCookie('token')
    res.json({
        status: 1,
        msg: "Logout Successfull"
    })
}

exports.get_listuser = (req, res) => {
    User.find({}).select('_id name email role avatar status').limit(10).exec((err, users) => {
        if (users && !err) {
            return res.json({
                status: 1,
                users
            })
        }
        return res.status(400).json({
            status: 0,
            err
        })
    })
}

exports.post_edituserinfo = (req, res) => {
    const { name, phone, about, filename, userId } = req.body
    let updateFiled = { name, phone, about }

    if(filename !== '') {
        updateFiled.avatar = filename
    }

    User.findOneAndUpdate({ _id: userId }, updateFiled, { new: true }).exec((err, user) => {
        if (!err && user) {
            const { _id, username, name, phone, about, email, avatar, role, status } = user
            return res.status(200).json({
                status: 1,
                user: { _id, username, name, phone, email, about, avatar, role, status }
            })
        }
        return res.status(400).json({
            status: 0,
            err
        })
    })
}

exports.get_userinfo = (req, res) => {
    const { id } = req.params
    User.findOne({ _id: id }).exec((err, user) => {
        if (err && !user) {
            return res.status(400).json({
                status: 0,
                error: 'User Not Found'
            })
        }
        const { _id, username, name, email, role, avatar, phone, about, status } = user;
        return res.json({
            status: 1,
            user: { _id, username, name, email, role, avatar, phone, about, status }
        })
    })
}

exports.post_changestatus = (req, res) => {
    const { userId, status } = req.body
    User.findOneAndUpdate({ _id: userId }, { status }, { new: true })
        .exec((err, user) => {
            if (err && !user) {
                return res.status(400).json({
                    error: err
                })
            }
            const { _id, username, name, status } = user
            return res.status(200).json({
                status: 1,
                user: { _id, username, name, status }
            })
        })
}

exports.post_changepassword = (req, res) => {
    const { userId, password, newPassword } = req.body
    User.findOne({ _id: userId }).exec((err, user) => {
        if (err && !user) {
            return res.status(400).json({
                error: err
            })
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Current password is not correct'
            })
        }
        const newEncryptPassword = user.encryptPassword(newPassword)
        User.findOneAndUpdate({ _id: user._id }, { hassed_password: newEncryptPassword })
            .exec((err, newUser) => {
                if (err && !newUser) {
                    return res.status(400).json({
                        error: 'Can not update Password'
                    }) 
                }
                return res.status(200).json({
                    status: 1,
                    msg: 'Password change successful'
                })
            })
    })
}