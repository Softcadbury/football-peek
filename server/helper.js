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
            console.log('Error while writing: ' + path + ' -> ' + err);
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
            console.log('Error while requesting: ' + url + ' -> ' + err);
        } else {
            var $ = cheerio.load(body);
            try {
                callback($);
            } catch (e) {
                console.log('Error while analysing: ' + url + ' -> ' + e);
            }
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
            if (err) {
                console.log('Error while downloading image: ' + path + ' -> ' + err);
            } else {
                request(src).pipe(fs.createWriteStream(path)).on('close', function () {
                    console.log('Image downloaded: ' + path);
                });
            }
        });
    }
}

// Helper to run an update of data
function runUpdate(itemsExtended, updateData, arg) {
    if (!arg) {
        return;
    }

    var itemArg = itemsExtended.find(itemExtended => itemExtended.item.smallName.toLowerCase() === arg);

    if (itemArg) {
        updateData(itemArg);
    } else {
        for (var i = 0; i < itemsExtended.length; i++) {
            updateData(itemsExtended[i]);
        }
    }
}

// Get the current round of a league
function getLeagueCurrentRound(resultsData) {
    if (!resultsData) {
        return 1;
    }

    var round = 1;

    for (var i = 0; i < resultsData.length; i++) {
        var result = resultsData[i];

        if (result.matches.filter(p => p.score === '-:-').length === result.matches.length) {
            break;
        }

        round = result.round;
    }

    return round;
}

module.exports = {
    stringSanitize: stringSanitize,
    stringFormat: stringFormat,
    readJsonFile: readJsonFile,
    writeJsonFile: writeJsonFile,
    scrapeUrl: scrapeUrl,
    manageFlagProperty: manageFlagProperty,
    manageLogoProperty: manageLogoProperty,
    runUpdate: runUpdate,
    getLeagueCurrentRound: getLeagueCurrentRound
};