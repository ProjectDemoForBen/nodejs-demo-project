const fs = require('fs');

const requestHandler = (req, res) => {
    const { url, method } = req;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');

        res.write('<html>');
        res.write('<head><title>Node Page</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');

        return res.end(); // set that there is not going to be any write calls anymore
    } else if (url === '/message' && method === 'POST') {

        const body = [];
        // listen to data event
        // fire whenever a new chunk is ready to be read
        req.on('data', (chunk) => {
            // chunk is a 'Buffer'
            // <Buffer 6d 65 73 73 61 67 65 3d 71 77 71>
            body.push(chunk);
        });
        // fire when incoming request finalize parsing
        return req.on('end', () => {
            // all the chunks are available in the body constant
            // Buffer is globally made available by NodeJS
            const parsedBody = Buffer.concat(body).toString(); // the toString works because the content uploaded is a string
            // "message=something"
            const message = parsedBody.split('=')[1];

            fs.writeFile('message.txt', message, (err) => {
                // redirect user to '/'
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });

        });
    }
}

// module.exports: global object expose by node
// the exported object is read only. From outside, data cannot be added
module.exports = {
    handler: requestHandler,
    someText: 'hardcoded text',
};