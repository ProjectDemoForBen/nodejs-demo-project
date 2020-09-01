const jwt = require('jsonwebtoken');
const config = require("../utils/config");

module.exports = (req, res, next) => {
    req.isAuth = false;

    if(req.method === 'OPTIONS')
        return next();
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, config.jwtsecret);
    } catch (e) {
        return next();
    }
    if (!decodedToken) {
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.id;
    next();
}