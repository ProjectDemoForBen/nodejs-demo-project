const fs = require('fs');

exports.removeFile = path => {
    fs.unlink(path, (err) => {
        if (err) {
            throw err;
        }
    });
}