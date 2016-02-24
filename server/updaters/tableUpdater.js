'use strict';

var config = require('../config');
var Converter = require('csvtojson').Converter;
var countries = ['England', 'France', 'Germany', 'Italy', 'Spain'];
var countryCodes = ['E0', 'F1', 'D1', 'I1', 'SP1'];
var currentYear = 2015;
var oldYear = 1993;

// Updates tables of current year
function updateCurrent() {
    var period = getPeriod(currentYear);
    var periodCode = getPeriodCode(currentYear);

    for (var i = 0; i < countries.length; i++) {
        updateData(countries[i], countryCodes[i], period, periodCode);
    }
}

// Updates tables of old years
function updateAll() {
    var years = [];

    for (var k = oldYear; k < currentYear; k++) {
        years.push(k);
    }

    for (var j = 0; j < years.length; j++) {
        var period = getPeriod(years[j]);
        var periodCode = getPeriodCode(years[j]);

        for (var i = 0; i < countries.length; i++) {
            updateData(countries[i], countryCodes[i], period, periodCode);
        }
    }
}

// Gets the period of a year (2001 -> 2001-2002)
function getPeriod(year) {
    return year + '-' + (year + 1);
}

// Gets the period code of a year (2001 -> 0102)
function getPeriodCode(year) {
    var part1 = ('00' + (year % 100)).slice(-2);
    var part2 = ('00' + ((year + 1) % 100)).slice(-2);

    return part1 + part2;
}

// Updates the table of a country by period
function updateData(country, countryCode, period, periodCode) {
    var converter = new Converter({ constructResult: false });
    var result = [];

    converter.on('record_parsed', (jsonObject) => {
        result.push(cleanJsonObject(jsonObject));
    });

    converter.on('end_parsed', () => {
        var fs = require('fs');
        var filePath = config.tableDataPath.replace('{0}', country).replace('{1}', period);

        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('File updated: ' + country + '-' + period);
            }
        });
    });

    var url = getUrl(periodCode, countryCode);
    require('request').get(url).pipe(converter);
}

// Gets the url to get the table for a period and a country
function getUrl(periodCode, countryCode) {
    return config.tableDataUrl.replace('{0}', periodCode).replace('{1}', countryCode);
}

// Clean the json object of undesirable properties
function cleanJsonObject(jsonObject) {
    var propertiesToKeep = ['Date', 'HomeTeam', 'AwayTeam', 'FTHG', 'FTAG', 'FTR'];

    for (var property in jsonObject) {
        if (propertiesToKeep.indexOf(property) === -1) {
            delete jsonObject[property];
        }
    }

    return jsonObject;
}

module.exports = {
    updateCurrent: updateCurrent,
    updateAll: updateAll
};