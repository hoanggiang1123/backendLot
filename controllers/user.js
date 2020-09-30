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

exports.get_user = (req, res) => {
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
    User.find({}).select('_id name email role avatar').limit(10).exec((err, users) => {
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