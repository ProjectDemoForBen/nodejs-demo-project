const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require("../utils/config");

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

    const {email, name, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        if (hashedPassword) {
            const user = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
            });
            res.status(200).json({
                message: 'User created!',
                user: {
                    id: user.id
                }
            })
        }

    } catch (err) {
        return next(err);
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            const err = new Error('Invalid Email or Password');
            err.statusCode = 400;
            throw err;
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            const err = new Error('Invalid Email or Password');
            err.statusCode = 400;
            throw err;
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, config.jwtsecret, {expiresIn: '1h'})

        res.status(200).json({
            token,
            userId: user.id,
        })
    } catch (err) {
        return next(err);
    }
}