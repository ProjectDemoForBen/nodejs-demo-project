exports.get404 = (req, res, next) => {
    res.status(404);
    // res.sendFile(path.join(rootDir, 'views', '404.html'));
    res.render('404', {
        pageTitle: 'Not Found',
        path: '',
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error :(',
        path: '/500',
    });
};
