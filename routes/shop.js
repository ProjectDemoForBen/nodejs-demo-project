const express = require("express");

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();


router.get('/', (req, res, next) => {
    res.send("<h1>Hello from Express</h1>");
});

module.exports = router;