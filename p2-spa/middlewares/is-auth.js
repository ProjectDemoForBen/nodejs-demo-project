const jwt = require('jsonwebtoken');
const config = require("../utils/config");
const User = require("../models/user");

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS')
        return next();
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        const err = new Error('Authorization not set')
        err.statusCode = 401;
        throw err;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, config.jwtsecret);
    } catch (e) {
        throw e;
    }
    if (!decodedToken) {
        const err = new Error('Invalid token');
        err.statusCode = 401;
        throw err;
    }

    const userId = decodedToken.id;
    User.findByPk(userId)
        .then(user => {
            if(!user){
                const err = new Error('User not found');
                err.statusCode = 401;
                throw err;
            }

            req.user = user;
            next();
        })
        .catch(err => {
            next(err);
        })
}