const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

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