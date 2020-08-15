const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findOne()
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;

            res.redirect('/');
        })
        .catch((error) => {
            console.log(error);
        });
};
