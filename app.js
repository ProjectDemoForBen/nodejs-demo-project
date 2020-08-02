const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// initializes express object that handles the incoming requests
const app = express();

// by default, express doesnt parse the request body, so add Parser Middleware
// text parser
// npm install --save body-parser
app.use(bodyParser.urlencoded({extended: false}));


// middlewares that should match all request should be put first
// eg
app.use('/', (req, res, next) => {
    // console.log("always run");
    next();
})

// para acceder al route de admin es necesario que
// tenga como prepend /admin
// ej. /admin/add-product
app.use('/admin' ,adminRoutes);   // dentro de adminRoutes, no es necesario saber que tiene como prepend /admin

app.use(shopRoutes);


// requests goes from top to bottom, so if it reaches this path, return an 404 page
app.use((req, res, next) => {

    res.status(404);
    res.send("<h1>Page not found :(</h1>")
});

app.listen(3000);

// now, request can be done accessing "localhost:3000"