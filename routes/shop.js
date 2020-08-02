const express = require("express");
const path = require("path");

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();


router.get('/', (req, res, next) => {
    // __dirname: get absolute path of the file where is used
    // path.join: concatenates files so it works on any OS  (do not use / (slashes))
    // "../" is allowed, to go up one level
    res.sendFile(path.join(__dirname, '../','views','shop.html'));
});

module.exports = router;