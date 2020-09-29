const express = require('express');
const router = express.Router();

const { post_signup, post_signin, get_user, get_signout } = require('../controllers/user')

const { runValidation } = require('../validator')

const { userSignUpValidation, userSignInValidation } = require('../validator/user')

const { checkLogin } = require('../helpers/auth')

router.post('/signup', userSignUpValidation, runValidation, post_signup);

router.post('/signin', userSignInValidation, runValidation, post_signin);

router.get('/', checkLogin, get_user);
router.get('/signout', checkLogin, get_signout);

module.exports = router;
