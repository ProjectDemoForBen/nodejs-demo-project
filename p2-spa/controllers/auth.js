const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require("../utils/config");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const {email, name, password} = req.body;
    bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            if (hashedPassword) {
                return User.create({
                    name: name,
                    email: email,
                    password: hashedPassword,
                });
            }
        })
        .then(user => {
            res.status(200).json({
                message: 'User created!',
                user: {
                    id: user.id
                }
            })
        })
        .catch(err => {
            next(err);
        })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body;

    let loadedUser = null;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (!user) {
            const err = new Error('Invalid Email or Password');
            err.statusCode = 400;
            throw err;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    }).then((match) => {
        if (!match) {
            const err = new Error('Invalid Email or Password');
            err.statusCode = 400;
            throw err;
        }
        const token = jwt.sign({
            id: loadedUser.id,
            email: loadedUser.email
        }, config.jwtsecret, {expiresIn: '1h'})

        res.status(200).json({
            token,
            userId: loadedUser.id,
        })
    }).catch(err => {
        next(err);
    })
}