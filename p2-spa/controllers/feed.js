const {validationResult} = require('express-validator');

const Post = require('../models/post');
const User = require("../models/user");
const {removeFile} = require("../utils/fileHelper");

exports.getPost = (req, res, next) => {
    const {postId} = req.params;

    Post.findByPk(postId, {
        include: [
            {model: User, as: 'creator'}
        ]
    }).then(post => {
        if (!post) {
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

    if (!req.file) {
        const error = new Error('No image provided!');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const {title, content} = req.body;

    req.user.createPost({
        title,
        content,
        imageUrl,
    }).then(post => {
        res.status(201).json({
            message: 'Post created!',
            post: {...post.dataValues, creator: req.user},
        });
    }).catch(err => {
        next(err);
    })
}

exports.updatePost = (req, res, next) => {
    const {postId} = req.params;
    const {title, content} = req.body;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const err = new Error("No image uploaded");
        err.statusCode = 422;
        throw err;
    }

    Post.findByPk(postId).then(post => {
        if (!post) {
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        if(post.imageUrl && post.imageUrl !== imageUrl){
            removeFile(post.imageUrl);
        }

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        return post.save();
    }).then(post => {
        return res.status(200).json({
            message: 'Post updated',
            post: {...post.dataValues, creator: req.user},
        });
    }).catch(err => {
        next(err);
    })
}


exports.deletePost = (req, res, next) => {
    const {postId} = req.params;

    Post.findByPk(postId).then(post => {
        if (!post) {
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        removeFile(post.imageUrl);
        return post.destroy();
    }).then(result => {
        res.status(200).json({
            message: 'Post deleted',
        })
    }).catch(err => {
        next(err);
    })
}