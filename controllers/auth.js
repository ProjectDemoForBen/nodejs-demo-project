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

exports.postLogout = (req, res, next) => {
    // all session data (in the database) is destroyed
    // the client still has the browser (but it's not a problem :) )
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};
