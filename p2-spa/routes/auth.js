const express = require('express');
const {body} = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', [
    body('email', 'Enter a valid email')
        .isEmail()
        .custom((value, {req}) => {
            return User.count({
                where: {
                    email: value
                }
            }).then(count => {
                if (count > 0) {
                    return Promise.reject('Email already exists');
                }
                return true;
            })
        })
        .normalizeEmail(),
    body('name', 'Name should not be empty')
        .trim()
        .notEmpty(),
    body('password', 'Password should have at least 5 characters')
        .isLength({min: 5})
        .notEmpty()
], authController.signup);

router.post('/login', [
    body('email', 'Enter a valid email')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password should have at least 5 characters')
        .isLength({min: 5})
        .notEmpty()
], authController.login);


module.exports = router;