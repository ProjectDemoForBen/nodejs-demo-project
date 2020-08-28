const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts/:postId', feedController.getPost);
router.get('/posts', feedController.getPosts);
router.post('/posts', [
    body('title', 'Title should have at least 5 characters').trim().isLength({min: 5}),
    body('content', 'Content should have at least 5 characters').trim().isLength({min: 5}),
], feedController.createPost);


module.exports = router;