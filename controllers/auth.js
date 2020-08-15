const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({
        email: email,
    })
        .then((user) => {
            if (!user) {
                return res.redirect('/login');
            }

            return bcrypt.compare(password, user.password).then((match) => {
                if (match) {
                    req.session.isLoggedIn = true;
                    req.session.userId = user._id;

                    // se podria directamente hacer el redirect,
                    // pero el redirect y el save se ejecutarian de manera independiente
                    // por lo que llamar a save explicitamente y esperar a que se guarde en la basededatos para
                    // hacer el redirect :)
                    req.session.save((error) => {
                        res.redirect('/');
                    });
                } else {
                    res.redirect('/login');
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.redirect('/login');
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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    User.findOne({
        email: email,
    })
        .then((result) => {
            if (result) {
                return res.redirect('/signup');
            } else {
                return bcrypt.hash(password, 12);
            }
        })
        .then((hashedPassword) => {
            if (hashedPassword) {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] },
                });
                return user.save();
            }
        })
        .then((result) => {
            res.redirect('/login');
        })
        .catch((error) => {
            console.log(error);
        });
};
