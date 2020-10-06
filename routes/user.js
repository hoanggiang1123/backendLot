const express = require('express');
const router = express.Router();

// const { uploadFile } = require('../helpers/upload')

// const uploadAvatar = uploadFile('user', 1, 'avatar')

const { post_signup, post_signin, get_userchecklogin, get_signout, get_listuser, post_edituserinfo, get_userinfo, post_changestatus, post_changepassword, post_changerolestatus } = require('../controllers/user')

const { runValidation } = require('../validator')

const { userSignUpValidation, userSignInValidation } = require('../validator/user')

const { checkLogin, requireAdmin, requireAdminOrOwner } = require('../helpers/auth')
const { parseForm } = require('../helpers/parseForm')

router.post('/edit', checkLogin, parseForm, requireAdminOrOwner, post_edituserinfo);

router.post('/signup', userSignUpValidation, runValidation, post_signup);

router.post('/signin', userSignInValidation, runValidation, post_signin);

router.get('/signout', checkLogin, get_signout);

router.get('/list', checkLogin, requireAdmin, get_listuser);

router.post('/change-status', checkLogin, requireAdmin, post_changestatus);

router.post('/change-password', checkLogin, requireAdminOrOwner, post_changepassword);

router.post('/change-role-status', checkLogin, requireAdmin, post_changerolestatus);

router.get('/:id', checkLogin, requireAdminOrOwner, get_userinfo)

router.get('/', checkLogin, get_userchecklogin);


module.exports = router;
