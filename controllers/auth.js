const User = require('../models/user');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '',
        },
    })
);

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
            return transporter.sendMail({
                to: result.email,
                from: 'chelo2252the@gmail.com',
                subject: 'Titulo',
                html: '<h1>Successfully signed up</h1>',
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getReset = (req, res, next) => {
    const error = req.flash('error');
    let message = null;
    if (error.length > 0) {
        message = error[0];
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
    });
};

exports.postReset = (req, res, next) => {
    const { email } = req.body;

    crypto.randomBytes(32, (err, buf) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buf.toString('hex');

        User.findOne({
            email: email,
        })
            .then((user) => {
                if (!user) {
                    req.flash('error', 'No email');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 300000;
                return user.save();
            })
            .then((user) => {
                res.redirect('/');
                return transporter.sendMail({
                    to: user.email,
                    from: 'chelo2252the@gmail.com',
                    subject: 'Reset Password',
                    html: `
                    <p>Someone just requested to change your account's credentials. If this was you, click on the link below to reset them.</p>
                    <a href="http://localhost:3000/reset-password/${token}">Link to reset credentials</a>
                    <p>This link will expire within 5 minutes.</p>
                    <p>If you don't want to reset your credentials, just ignore this message and nothing will be changed.</p>
                    `,
                });
            });
    });
};

exports.getResetPassword = (req, res, next) => {
    const error = req.flash('error');
    let message = null;
    if (error.length > 0) {
        message = error[0];
    }

    const { token } = req.params;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now(),
        },
    })
        .then((user) => {
            if (!user) {
                return res.redirect('/');
            }
            res.render('auth/reset-password', {
                path: '/reset-password',
                pageTitle: 'Reset Password',
                errorMessage: message,
                userId: user._id,
                passwordToken: token,
            });
        })
        .catch((error1) => {
            console.log(error1);
        });
};

exports.postResetPassword = (req, res, next) => {
    const { userId, password, passwordToken } = req.body;

    let userF = null;
    User.find({
        resetToken: password,
        resetTokenExpiration: {
            $gt: Date.now(),
        },
        _id: userId,
    })
        .then((user) => {
            if (!user) {
                return res.redirect('/');
            }

            userF = user;
            return bcrypt.hash(password, 12);
        })
        .then((hashedPassword) => {
            if (hashedPassword) {
                userF.password = hashedPassword;
                userF.resetToken = null;
                userF.resetTokenExpiration = undefined;
                return userF.save();
            }
        })
        .then((user) => {
            console.log(user);
            res.redirect('/login');
        })
        .catch((error) => {
            console.log(error);
        });
};
