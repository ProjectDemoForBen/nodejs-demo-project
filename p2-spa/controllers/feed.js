const {validationResult} = require('express-validator');

const Post = require('../models/post');
const User = require("../models/user");

exports.getPost = (req, res, next) => {
    const {postId} = req.params;

    Post.findByPk(postId, {
        include: [
            {model: User, as: 'creator'}
        ]
    }).then(post => {
        if(!post){
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            post
        });
    }).catch(err => {
        next(err);
    })
}

exports.getPosts = (req, res, next) => {
    Post.findAll({
        include: [
            {model: User, as: 'creator'}
        ]
    }).then(result => {
        res.status(200).json({
            posts: result,
            totalItems: result.length,
        });
    }).catch(err => {
        next(err);
    })
}


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        throw error;
    }
    const {title, content} = req.body;

    req.user.createPost({
        title,
        content,
        imageUrl: '/images/2020-08-07_20-23.png',
    }).then(post => {

        res.status(201).json({
            message: 'Post created!',
            post: {...post.dataValues, creator: req.user},
        });
    }).catch(err => {
        next(err);
    })


}