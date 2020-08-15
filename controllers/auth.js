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
            req.session.userId = user._id;

            // se podria directamente hacer el redirect,
            // pero el redirect y el save se ejecutarian de manera independiente
            // por lo que llamar a save explicitamente y esperar a que se guarde en la basededatos para
            // hacer el redirect :)
            req.session.save((error) => {
                res.redirect('/');
            });
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
