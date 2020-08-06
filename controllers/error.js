exports.get404 = (req, res, next) => {
    res.status(404);
    // res.sendFile(path.join(rootDir, 'views', '404.html'));
    res.render('404', { pageTitle: 'Not Found', path: '' });
};
