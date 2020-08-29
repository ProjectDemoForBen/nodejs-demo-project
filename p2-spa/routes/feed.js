const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

const postBodyValidation = [
    body('title', 'Title should have at least 5 characters').trim().isLength({min: 5}),
    body('content', 'Content should have at least 5 characters').trim().isLength({min: 5}),
];

router.use(isAuth);

router.get('/posts/:postId', feedController.getPost);
router.get('/posts', feedController.getPosts);
router.post('/posts', postBodyValidation, feedController.createPost);
router.put('/posts/:postId', postBodyValidation, feedController.updatePost);
router.delete('/posts/:postId', feedController.deletePost);

module.exports = router;