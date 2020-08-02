const http = require('http');
const routes = require('./routes');


// function that executes for every single request that reaches the server
// returns: server
const server = http.createServer(routes.handler);

// starts a proccess where NodeJs will listen for incoming request
server.listen(3000)

// now, request can be done accessing "localhost:3000"