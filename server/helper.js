'use strict';

// Format a string with arguments
function stringFormat(str) {
    for (var i = 0; i + 1 < arguments.length; i++) {
        str = str.replace('{' + i + '}', arguments[i + 1]);
    }

    return str;
}

// Read a json file and call the callback with its content
function readJsonFile(path, callback) {
    var jsonfile = require('jsonfile');
    jsonfile.readFile(path, { throws: false }, (err, data) => {
        callback(data || []);
    });
}

// Write content in a json file
function writeJsonFile(path, content) {
    var fs = require('fs');
    fs.writeFile(path, JSON.stringify(content, null, 4), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File updated: ' + path);
        }
    });
}

module.exports = {
    stringFormat: stringFormat,
    readJsonFile: readJsonFile,
    writeJsonFile: writeJsonFile
};