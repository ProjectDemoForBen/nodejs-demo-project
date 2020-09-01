const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require("../utils/config");

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
        if(!req.isAuth){
            const err = new Error('User is not authenticated');
            err.code = 401;
            throw err;
        }

        const {title, content, imageUrl} = args.postInput;

        const errors = [];
        if(!validator.isLength(title, {min: 5})){
            errors.push({message: 'Title should have at least 5 characters'})
        }
        if(!validator.isLength(content, {min: 5})){
            errors.push({message: 'Conten should have at least 5 characters'})
        }
        if(errors.length > 0){
            const err = new Error('Invalid input');
            err.data = errors;
            err.code = 422;
            throw err;
        }

        const user = await User.findByPk(req.userId);
        if(!user){
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
    }
}
