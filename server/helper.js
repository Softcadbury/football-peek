'use strict';

var jsonfile = require('jsonfile');

// Read a json file and call the callback with its content
function readJsonFile(path, pathArguments, callback) {
    for (var i = 0; i < pathArguments.length; i++) {
        path = path.replace('{' + i + '}', pathArguments[i]);
    }

    jsonfile.readFile(path, { throws: false }, (err, data) => {
        callback(data || []);
    });
}

module.exports = readJsonFile;