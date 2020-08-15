const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_DB_URI =
    'mongodb://root:example@localhost:27017/shop?authSource=admin&w=1';

// initializes express object that handles the incoming requests
const app = express();
const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions', // collection where sessions data will be store
});

app.set('view engine', 'ejs');

// use html views stored in the views folder
app.set('views', 'views');

// by default, express doesnt parse the request body, so add Parser Middleware
// text parser
// npm install --save body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// middleware that allows us to serve static files (forwarded directly from the filesystem)
// gives read access to the root path
app.use(express.static(path.join(__dirname, 'public')));
// can register multiple static folders, it will go through all of them until it gets a match

app.use(
    session({
        secret: 'secret', // used to hash the sessionId
        resave: false, // session is not saved on every request but only when it changes
        saveUninitialized: false,
        store: store,
    })
);

app.use((req, res, next) => {
    if (req.session.userId) {
        User.findById(req.session.userId)
            .then((user) => {
                req.user = user;
                next();
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        next();
    }
});

// middlewares that should match all request should be put first
// eg
app.use('/', (req, res, next) => {
    console.log('always run');
    next();
});

// para acceder al route de admin es necesario que
// tenga como prepend /admin
// ej. /admin/add-product
app.use('/admin', adminRoutes); // dentro de adminRoutes, no es necesario saber que tiene como prepend /admin

app.use(shopRoutes);
app.use(authRoutes);

// requests goes from top to bottom, so if it reaches this path, return an 404 page
app.use(errorController.get404);

mongoose
    .connect(MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        app.listen(3000);
    })
    .catch((error) => {
        console.log(error);
    });

// now, request can be done accessing "localhost:3000"
