const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    // set all domains that could do request to server. * every domain
    res.setHeader('Access-Control-Allow-Origin', '*');

    // methods that client can request
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // headers that client can add to the request (there are default headers that are always allowed)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
})
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/feed', feedRoutes);

app.listen(8080);