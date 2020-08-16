module.exports = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        req.flash('error', 'Please log in');
        res.redirect('/login');
    }
};
