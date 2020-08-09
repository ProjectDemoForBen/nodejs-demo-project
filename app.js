const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

// initializes express object that handles the incoming requests
const app = express();

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

app.use((req, res, next) => {
    console.log('retrieving user');
    // add User to the request, so the following functions can access the user
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((error) => {
            console.log(error);
        });
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

// requests goes from top to bottom, so if it reaches this path, return an 404 page
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// syncs models to the db (creating tables, relations, ...)
sequelize
    .sync()
    .then((result) => {
        // console.log(result);
        return User.findByPk(1);
    })
    .then((result) => {
        if (result) {
            return Promise.resolve(result);
        } else {
            return User.create({
                name: 'Marcelo',
                email: 'marcelo@cardozo.com',
            });
        }
    })
    .then((user) => {
        user.getCart()
            .then((cart) => {
                if (!cart) {
                    return user.createCart();
                }
                return cart;
            })
            .then((cart) => {
                console.log(cart);
                app.listen(3000);
            })
            .catch((error) => {
                console.log(error);
            });
    })
    .catch((error) => {
        console.log('error: ', error);
    });

// now, request can be done accessing "localhost:3000"
