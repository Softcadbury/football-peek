'use strict';

// Sanitizes a string to be a filename
function stringSanitize(str) {
    return str
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/æ/g, 'ae')
        .replace(/ç/g, 'c')
        .replace(/ñ/g, 'n')
        .replace(/œ/g, 'oe')
        .replace(/[ýÿ]/g, 'y')
        .replace(/[^a-z0-9]/gi, '_');
}

// Formats a string with arguments
function stringFormat(str) {
    for (var i = 0; i + 1 < arguments.length; i++) {
        str = str.replace('{' + i + '}', arguments[i + 1]);
    }

    return str;
}

// Reads a json file and return its content
function readJsonFile(path) {
    var fileExists = require('file-exists');
    var jsonfile = require('jsonfile');

    if (!fileExists(path)) {
        return [];
    }

    return jsonfile.readFileSync(path, { throws: false });
}

// Writes content in a json file
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

// Scrapes an url and call the callback with its content
function scrapeUrl(url, callback) {
    var request = require('request');
    var cheerio = require('cheerio');

    request(url, (err, resp, body) => {
        if (err) {
            console.log(err);
        } else {
            var $ = cheerio.load(body);
            callback($);
        }
    });
}

// Manage the flag property of an object
function manageFlagProperty(item) {
    var config = require('./config');
    item.flag = stringSanitize(item.country);
    downloadImage('http:' + item.flagSrc, stringFormat(config.paths.flagsData, item.flag));
    delete item.flagSrc;
}

// Manage the logo property of an object
function manageLogoProperty(item) {
    var config = require('./config');
    item.logo = stringSanitize(item.team);
    downloadImage('http:' + item.logoSrc, stringFormat(config.paths.logosData, item.logo));
    delete item.logoSrc;
}

// Download an image in a path
function downloadImage(src, path) {
    var fileExists = require('file-exists');
    var request = require('request');
    var fs = require('fs');

    if (!fileExists(path)) {
        request.head(src, function (err, res, body) {
            request(src).pipe(fs.createWriteStream(path)).on('close', function () {
                console.log('Image updated: ' + path);
            });
        });
    }
}

module.exports = {
    stringSanitize: stringSanitize,
    stringFormat: stringFormat,
    readJsonFile: readJsonFile,
    writeJsonFile: writeJsonFile,
    scrapeUrl: scrapeUrl,
    manageFlagProperty: manageFlagProperty,
    manageLogoProperty: manageLogoProperty
};