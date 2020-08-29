const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require("multer");
const {v4: uuidv4} = require('uuid')

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const sequelize = require('./utils/database');
const Post = require('./models/post');
const User = require('./models/user');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const err = null;
        const folder = './images';
        cb(err, folder);
    },
    filename: (req, file, cb) => {
        const err = null;
        cb(err, uuidv4());
    },
});

const fileFilter = (req, file, cb) => {
    // only accept png, jpg and jpeg files
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
  multer({
      storage: fileStorage,
      fileFilter: fileFilter,
  }).single('image')
);
app.use((req, res, next) => {
    // set all domains that could do request to server. * every domain
    res.setHeader('Access-Control-Allow-Origin', '*');

    // methods that client can request
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // headers that client can add to the request (there are default headers that are always allowed)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
})
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            next();
        });
})

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        data: err.data,
    })
})

User.hasMany(Post, {
    foreignKey: {
        name: 'creatorId',
        allowNull: false
    }
});
Post.belongsTo(User, {
    as: 'creator',
    constraints: true,
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'creatorId',
        allowNull: false
    }
});


sequelize
    .sync({force: true})
    .then(result => {
        console.log(result);
        return User.findByPk(1);
    })
    .then(user => {
        if (user) {
            return Promise.resolve(user);
        } else {
            return User.create({
                name: 'Marcelo Cardozo',
                email: 'marcelo.r.cardozo.g@gmail.com',
                password: 'password',
                status: ''
            })
        }
    })
    .then(user => {
        return user.getPosts()
            .then(posts => {
                console.log(posts);
                if (posts.length === 0) {
                    return user.createPost({
                        title: 'Prueba',
                        content: 'Content prueba',
                        imageUrl: 'images/2020-08-07_20-23.png'
                    });
                } else {
                    return Promise.resolve(posts[0]);
                }
            })
    })
    .then(post => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });

