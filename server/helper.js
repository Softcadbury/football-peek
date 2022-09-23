'use strict';

const jsonfile = require('jsonfile');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const winston = require('winston');
const NodeCache = require('node-cache');
const config = require('./config');

const jsonFileCache = new NodeCache({ stdTTL: 300 });

winston.configure({ transports: [new winston.transports.File({ filename: 'info.log' }), new winston.transports.Console()] });

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
    for (let i = 0; i + 1 < arguments.length; i++) {
        str = str.replace('{' + i + '}', arguments[i + 1]);
    }

    return str;
}

// Reads a json file and return its content
function readJsonFile(path) {
    if (!fs.existsSync(path)) {
        return [];
    }

    return jsonfile.readFileSync(path, {
        throws: false
    });
}

// Reads a json file from cache and return its content
function readCachedJsonFile(path) {
    let value = jsonFileCache.get(path);

    if (value) {
        return value;
    }

    value = readJsonFile(path);
    jsonFileCache.set(path, value);

    return value;
}

// Writes content in a json file
function writeJsonFile(path, content, resolve) {
    fs.mkdir(path.substring(0, path.lastIndexOf('/') + 1), { recursive: true }, err1 => {
        if (err1) {
            log('Error while creating folder: ' + path + ' -> ' + err1);
            resolve();
        } else {
            fs.writeFile(path, JSON.stringify(content, null, 4), err2 => {
                if (err2) {
                    log('Error while writing: ' + path + ' -> ' + err2);
                    resolve();
                } else {
                    log('File updated: ' + path);
                    resolve();
                }
            });
        }
    });
}

// Scrapes an url and call the callback with its content
function scrapeUrl(url, callback) {
    request(url, (err, resp, body) => {
        if (err) {
            log('Error while requesting: ' + url + ' -> ' + err);
        } else {
            const $ = cheerio.load(body);
            try {
                callback($);
            } catch (e) {
                log('Error while analysing: ' + url + ' -> ' + e);
            }
        }
    });
}

// Manage the flag property of an object
function manageFlagProperty(item) {
    item.flag = stringSanitize(item.country);

    if (config.updateWithImagesDownload) {
        downloadImage(extractSrcFromHtmlElement(item.flagSrc), stringFormat(config.paths.flagsData, item.flag));
    }

    delete item.flagSrc;
}

// Manage the logo property of an object
function manageLogoProperty(item) {
    item.logo = stringSanitize(item.team);

    if (config.updateWithImagesDownload) {
        downloadImage(extractSrcFromHtmlElement(item.logoSrc), stringFormat(config.paths.logosData, item.logo));
    }

    delete item.logoSrc;
}

// Fix to retrieve the src from the html element.
// > img').attr('src') doesn't seem to work with Cheerio anymore.
function extractSrcFromHtmlElement(htmlElement) {
    return htmlElement.substring(htmlElement.indexOf('src=') + 5, htmlElement.indexOf('width=') - 2);
}

// Download an image in a path
function downloadImage(src, path) {
    if (!fs.existsSync(path) && !path.endsWith('/.gif')) {
        request.head(src, err => {
            if (err) {
                log('Error while downloading image: ' + path + ' -> ' + err);
            } else {
                request(src)
                    .pipe(fs.createWriteStream(path))
                    .on('close', () => {
                        log('Image downloaded: ' + path);
                    });
            }
        });
    }
}

// Get the current round of a league
function getLeagueCurrentRound(resultsData) {
    if (!resultsData) {
        return 1;
    }

    let round = 1;

    for (let i = 0; i < resultsData.length; i++) {
        const result = resultsData[i];

        // To be the current round, the round must be not played and same for the next two rounds
        if (isRoundNotPlayed(result) && isRoundNotPlayed(resultsData[i + 1]) && isRoundNotPlayed(resultsData[i + 2])) {
            break;
        }

        round = result.round;
    }

    return round;
}

// Check if a round is not played, i.e. all matches are not played
function isRoundNotPlayed(result) {
    return !result || result.matches.filter(p => p.score === '-:-').length === result.matches.length;
}

// Log a message in the console and a log file
function log(message) {
    winston.info(message);
}

module.exports = {
    stringSanitize,
    stringFormat,
    readJsonFile,
    readCachedJsonFile,
    writeJsonFile,
    scrapeUrl,
    manageFlagProperty,
    manageLogoProperty,
    getLeagueCurrentRound,
    log
};