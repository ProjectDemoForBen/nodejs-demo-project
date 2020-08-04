const path = require('path')
const express = require('express')

const rootDir = require('../utils/path')

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router()

// default path is '/'
// use: it is a startsWith so, the specific address should be put first
// get,... : the url should match the path
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/add-product', (req, res, next) => {
    // req.body is added by ExpressJS

    const title = req.body.title
    console.log(title)
    res.redirect('/')
})

module.exports = router
