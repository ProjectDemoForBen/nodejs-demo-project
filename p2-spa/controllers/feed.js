const {validationResult} = require('express-validator');

const Post = require('../models/post');
const User = require("../models/user");
const {removeFile} = require("../utils/fileHelper");
const io = require('../socket');


exports.getPost = async (req, res, next) => {
    const {postId} = req.params;

    try {
        const post = await Post.findByPk(postId, {
            include: [
                {model: User, as: 'creator'}
            ]
        })

        if (!post) {
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            post
        });

    } catch (err) {
        next(err);
    }
}

exports.getPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const pageSize = 2;

    try {
        const result = await Post.findAndCountAll({
            include: [
                {model: User, as: 'creator'}
            ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            posts: result.rows,
            totalItems: result.count,
        });
    } catch (err) {
        next(err);
    }
}


exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

    if (!req.file) {
        const error = new Error('No image provided!');
        error.statusCode = 422;
        return next(error);
    }

    const imageUrl = req.file.path;
    const {title, content} = req.body;

    try {
        const post = await req.user.createPost({
            title,
            content,
            imageUrl,
        });

        const postData = {...post.dataValues, creator: req.user};

        // channel: posts
        // action: create
        io.getIO().emit('posts', {
            action: 'create',
            data: postData
        });

        res.status(201).json({
            message: 'Post created!',
            post: postData
        });
    } catch (err) {
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {
    const {postId} = req.params;
    const {title, content} = req.body;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const err = new Error("No image uploaded");
        err.statusCode = 422;
        return next(err);
    }

    try {
        let post = await Post.findByPk(postId);

        if (!post) {
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        if (post.creatorId !== req.user.id) {
            const err = new Error('User not authorized');
            err.statusCode = 401;
            throw err;
        }

        if (post.imageUrl && post.imageUrl !== imageUrl) {
            removeFile(post.imageUrl);
        }

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        post = await post.save();

        const postData = {...post.dataValues, creator: req.user};
        io.getIO().emit('posts', {
            action: 'update',
            data: postData
        });

        return res.status(200).json({
            message: 'Post updated',
            post: {...post.dataValues, creator: req.user},
        });
    } catch (err) {
        return next(err);
    }
}


exports.deletePost = async (req, res, next) => {
    const {postId} = req.params;

    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        if (post.creatorId !== req.user.id) {
            const err = new Error('User not authorized');
            err.statusCode = 401;
            throw err;
        }
        removeFile(post.imageUrl);

        await post.destroy();

        io.getIO().emit('posts', {
            action: 'delete',
            data: postId
        });

        res.status(200).json({
            message: 'Post deleted',
        })
    } catch (err) {
        next(err);
    }
}