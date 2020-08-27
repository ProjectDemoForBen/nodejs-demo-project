const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                id: 1,
                title: 'First Post',
                content: 'This is the first post',
                creator: {
                    name: 'Marcelo Cardozo',
                },
                imageUrl: '/images/2020-08-07_20-23.png',
                createdAt: new Date().toISOString(),
            }
        ],
        totalItems: 1,
    });
}


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
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