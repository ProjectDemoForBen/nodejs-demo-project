exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    // Set-Cookie: is a reserved header
    // the value is a key=value pair
    res.setHeader('Set-Cookie', 'isLoggedIn=true; HttpOnly');

    res.redirect('/');
};
