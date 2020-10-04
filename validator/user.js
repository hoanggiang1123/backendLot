const { check } = require('express-validator')

exports.userSignUpValidation = [
  check('name').not().isEmpty().withMessage('name is require'),
  check('name').isLength({ min: 6 }).withMessage('name must be at least 6 characters'),
  check('username').not().isEmpty().withMessage('username is require'),
  check('username').isLength({ min: 6 }).withMessage('username must be at least 6 characters'),
  check('email').isEmail().withMessage('Email must be valid'),
  check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.userSignInValidation = [
  check('email')
      .isEmail()
      .withMessage('Email must be valid'),
  check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
];

exports.userEditIfo = [
  check('name').notEmpty().isLength({ min: 6 }).withMessage('name must be at least 6 characters')
]
