const express = require('express');
const router = express.Router();

const { uploadFile } = require('../helpers/upload')

const uploadAvatar = uploadFile('user', 1, 'avatar')

const { post_signup, post_signin, get_userchecklogin, get_signout, get_listuser, post_edituserinfo, get_userinfo, post_changestatus, post_changepassword } = require('../controllers/user')

const { runValidation } = require('../validator')

const { userSignUpValidation, userSignInValidation, userEditIfo } = require('../validator/user')

const { checkLogin, requireAdmin } = require('../helpers/auth')
const { parseForm } = require('../helpers/parseForm')

router.post('/edit', checkLogin, requireAdmin, parseForm, post_edituserinfo);

router.post('/signup', userSignUpValidation, runValidation, post_signup);

router.post('/signin', userSignInValidation, runValidation, post_signin);

router.get('/signout', checkLogin, get_signout);

router.get('/list', checkLogin, requireAdmin, get_listuser);

router.post('/change-status', checkLogin, requireAdmin, post_changestatus);

router.post('/change-password', checkLogin, requireAdmin, post_changepassword);

router.get('/:id', checkLogin, requireAdmin, get_userinfo)

router.get('/', checkLogin, get_userchecklogin);


module.exports = router;
