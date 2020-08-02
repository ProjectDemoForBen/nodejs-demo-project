const path = require("path");

// path.dirname: returns directory name of a path
// process.mainModule: module that started the application (app.js)
module.exports = path.dirname(process.mainModule.filename);