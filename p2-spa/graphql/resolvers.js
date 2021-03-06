const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Post = require('../models/post');
const User = require('../models/user');
const config = require("../utils/config");
const {removeFile} = require("../utils/fileHelper");

// a function for every query/mutation defined in the schema, the name has to match
module.exports = {

    // the data defined in the schema is what the function must return
    createUser: async function (args, req) {
        // args: object containing all the arguments passed to the function
        const {email, name, password} = args.userInput;

        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({message: 'Email is invalid'});
        }
        if (validator.isEmpty(password) || !validator.isLength(password, {min: 5})) {
            errors.push({message: 'Password should have at least 5 characters'});
        }

        if (errors.length > 0) {
            const err = new Error('Invalid input');
            err.data = errors;
            err.code = 422;
            throw err;
        }

        // return User.count().then()
        // or
        const count = await User.count({
            where: {
                email: email
            }
        });

        if (count > 0) {
            const err = new Error('Email already exists');
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        if (!hashedPassword) {
            const err = new Error('Password could not be hashed');
            throw err;
        }

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        return {...user.dataValues, posts: []}

    },
    login: async function (args, req) {
        const {email, password} = args;

        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            const err = new Error('Invalid Email or Password');
            err.code = 400;
            throw err;
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            const err = new Error('Invalid Email or Password');
            err.code = 400;
            throw err;
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, config.jwtsecret, {expiresIn: '1h'})


        return {token, userId: user.id};
    },
    createPost: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }

        const {title, content, imageUrl} = args.postInput;

        const errors = [];
        if (!validator.isLength(title, {min: 5})) {
            errors.push({message: 'Title should have at least 5 characters'})
        }
        if (!validator.isLength(content, {min: 5})) {
            errors.push({message: 'Conten should have at least 5 characters'})
        }
        if (errors.length > 0) {
            const err = new Error('Invalid input');
            err.data = errors;
            err.code = 422;
            throw err;
        }

        const user = await User.findByPk(req.userId);
        if (!user) {
            const err = new Error('Invalid user');
            err.code = 401;
            throw err;
        }

        const post = await user.createPost({
            title,
            content,
            imageUrl,
        });

        return {...post.dataValues, creator: user};
    },
    getPosts: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }

        const page = args.page || 1;
        const pageSize = 2;

        const result = await Post.findAndCountAll({
            include: [
                {model: User, as: 'creator'}
            ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });

        return {
            posts: result.rows,
            totalItems: result.count,
        }
    },
    getPost: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }

        const {id} = args;

        const post = await Post.findByPk(id, {
            include: [
                {model: User, as: 'creator'}
            ]
        })

        if (!post) {
            const err = new Error('Post not found');
            err.code = 404;
            throw err;
        }

        return post;
    },
    updatePost: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }
        const {id, postInput} = args;
        const {title, content, imageUrl} = postInput;

        const errors = [];
        if (!validator.isLength(title, {min: 5})) {
            errors.push({message: 'Title should have at least 5 characters'})
        }
        if (!validator.isLength(content, {min: 5})) {
            errors.push({message: 'Content should have at least 5 characters'})
        }
        if (errors.length > 0) {
            const err = new Error('Invalid input');
            err.data = errors;
            err.code = 422;
            throw err;
        }

        let post = await Post.findByPk(id, {
            include: [
                {model: User, as: 'creator'}
            ]
        });

        if (!post) {
            const err = new Error('Post not found');
            err.code = 404;
            throw err;
        }

        const user = await User.findByPk(req.userId);
        if (!user) {
            const err = new Error('Invalid user');
            err.code = 401;
            throw err;
        }

        if (post.creator.id !== user.id) {
            const err = new Error('User not authorized');
            err.code = 401;
            throw err;
        }

        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        post = await post.save();

        return {...post.dataValues, creator: user};
    },
    deletePost: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }
        const {id} = args;

        let post = await Post.findByPk(id, {
            include: [
                {model: User, as: 'creator'}
            ]
        });

        if (!post) {
            const err = new Error('Post not found');
            err.code = 404;
            throw err;
        }

        const user = await User.findByPk(req.userId);
        if (!user) {
            const err = new Error('Invalid user');
            err.code = 401;
            throw err;
        }

        if (post.creator.id !== user.id) {
            const err = new Error('User not authorized');
            err.code = 401;
            throw err;
        }

        removeFile(post.imageUrl);

        await post.destroy();

        return true;
    },
    getUserStatus: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }
        const {id} = args;

        const user = await User.findByPk(id);
        if (!user) {
            const err = new Error('Invalid user');
            err.code = 401;
            throw err;
        }

        return user.status;
    },
    updateStatus: async function (args, req) {
        if (!req.isAuth) {
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }
        const {id, status} = args;

        if (parseInt(id) !== req.userId) {
            const err = new Error('User not authorized');
            err.code = 401;
            throw err;
        }
        const user = await User.findByPk(req.userId);
        user.status = status;
        await user.save();

        return true;
    }

}
