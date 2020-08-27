const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post(
    '/login',
    [
        body('email', 'email should have email format :P')
            .isEmail()
            .normalizeEmail(),
        body(
            'password',
            'password should be at least 6 characters long and alphanumeric'
        )
            .isAlphanumeric()
            .isLength({ min: 6 }),
    ],
    authController.postLogin
);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post(
    '/signup',
    [
        body('email', 'email should have email format :P')
            .isEmail()
            .custom((value) => {
                if (!value.endsWith('gmail.com')) {
                    throw new Error('Email should be from gmail c:');
                }

                return User.findOne({ email: value }).then((result) => {
                    if (result) {
                        return Promise.reject('Email already used');
                    }
                });
            })
            .normalizeEmail(),
        body(
            'password',
            'password should be at least 6 characters long and alphanumeric'
        )
            .isLength({ min: 6 })
            .isAlphanumeric(),
        body('confirmPassword', 'passwords have to match').custom(
            (value, { req }) => {
                return value === req.body.password;
            }
        ),
    ],
    authController.postSignup
);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

module.exports = router;
