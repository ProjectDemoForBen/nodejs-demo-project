const express = require("express");

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();


// default path is '/'
// use: it is a startsWith so, the specific address should be put first
// get,... : the url should match the path
router.get('/add-product', (req, res, next) => {
    res.send(
        '<html>' +
        '<head><title>Node Page</title></head>' +
        '<body>' +

        '<form action="./product" method="POST">' +
        '<input type="text" name="title"><button type="submit">Add Product</button>' +
        '</form>' +

        '</body>' +
        '</html>');

});

router.post('/product', (req, res, next) => {
    // req.body is added by ExpressJS

    const title = req.body.title;
    console.log(title);
    res.redirect('/');
})

module.exports = router;
