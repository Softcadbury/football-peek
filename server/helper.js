'use strict';

var jsonfile = require('jsonfile');

// Format a string with arguments
function stringFormat(str) {
    for (var i = 0; i + 1 < arguments.length; i++) {
        str = str.replace('{' + i + '}', arguments[i + 1]);
    }

    return str;
}

// Read a json file and call the callback with its content
function readJsonFile(path, callback) {
    jsonfile.readFile(path, { throws: false }, (err, data) => {
        callback(data || []);
    });
}

module.exports = {
    stringFormat: stringFormat,
    readJsonFile: readJsonFile
};