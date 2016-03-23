'use strict';

var config = require('./config');
var leagues = require('../common/leagues');

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

// Reads a json file and call the callback with its content
function readJsonFile(path, callback) {
    var jsonfile = require('jsonfile');
    jsonfile.readFile(path, { throws: false }, (err, data) => {
        callback(data || []);
    });
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

// Gets the data of a league
function getLeagueData(code) {
    var league = {};

    for (var item in leagues) {
        if (leagues[item].code === code) {
            league = leagues[item];
            break;
        }
    }

    return league;
}

// Add the logo for a league and its data (optional)
function AddLogos(league, data) {
    var imageDataPath = config.paths.imageData.replace('/data', '');

    league.logo = stringFormat(imageDataPath, league.code, 'logo');

    if (data) {
        for (var i = 0; i < data.length; i++) {
            data[i].logo = stringFormat(imageDataPath, league.code, stringSanitize(data[i].team));
        }
    }
}

module.exports = {
    stringSanitize: stringSanitize,
    stringFormat: stringFormat,
    readJsonFile: readJsonFile,
    writeJsonFile: writeJsonFile,
    scrapeUrl: scrapeUrl,
    getLeagueData: getLeagueData,
    AddLogos: AddLogos
};