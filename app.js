const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./utils/path');

// initializes express object that handles the incoming requests
const app = express();
app.set('view engine', 'pug');
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

// middlewares that should match all request should be put first
// eg
app.use('/', (req, res, next) => {
    // console.log("always run");
    next();
});

// para acceder al route de admin es necesario que
// tenga como prepend /admin
// ej. /admin/add-product
app.use('/admin', adminData.router); // dentro de adminRoutes, no es necesario saber que tiene como prepend /admin

app.use(shopRoutes);

// requests goes from top to bottom, so if it reaches this path, return an 404 page
app.use((req, res, next) => {
    res.status(404);

    // res.sendFile(path.join(rootDir, 'views', '404.html'));
    res.render('404', { pageTitle: 'Not Found' });
});

app.listen(3000);

// now, request can be done accessing "localhost:3000"
