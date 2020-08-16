const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    const error = req.flash('error');
    let message = null;
    if (error.length > 0) {
        message = error[0];
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({
        email: email,
    })
        .then((user) => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
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
                    req.flash('error', 'Invalid email or password');
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
    const error = req.flash('error');
    let message = null;
    if (error.length > 0) {
        message = error[0];
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: message,
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    User.findOne({
        email: email,
    })
        .then((result) => {
            if (result) {
                req.flash('error', 'Email already used');
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
