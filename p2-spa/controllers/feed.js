const {validationResult} = require('express-validator');

const Post = require('../models/post');
const User = require("../models/user");

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
    })
}


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed!',
            errors: errors.array(),
        })
    }
    const {title, content} = req.body;

    res.status(201).json({
        message: 'Post created!',
        post: {
            id: new Date().toISOString(),
            title,
            content,
            creator: {
                name: 'Marcelo Cardozo',
            },
            createdAt: new Date().toISOString(),
        }
    });


}