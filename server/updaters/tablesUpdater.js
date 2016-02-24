'use strict';

var config = require('../config');
var Converter = require('csvtojson').Converter;
var fs = require('fs');
var request = require('request');

var oldestYear = 1993;
var tableDataUrl = 'http://www.football-data.co.uk/mmz4281/{0}/{1}.csv';
var leagues = [
    { name: config.leagues.bundesliga, code: 'D1' },
    { name: config.leagues.liga, code: 'SP1' },
    { name: config.leagues.ligue1, code: 'F1' },
    { name: config.leagues.serieA, code: 'I1' },
    { name: config.leagues.premierLeague, code: 'E0' }
];

// Updates tables of current year
function updateCurrent() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i], config.currentYear);
    }
}

// Updates tables of old years
function updateAll() {
    var years = [];

    for (var k = oldestYear; k < config.currentYear; k++) {
        years.push(k);
    }

    for (var j = 0; j < years.length; j++) {
        for (var i = 0; i < leagues.length; i++) {
            updateData(leagues[i], years[j]);
        }
    }
}

// Updates the table of a league by period
function updateData(league, year) {
    var converter = new Converter({ constructResult: false });
    var result = [];

    converter.on('record_parsed', (jsonObject) => {
        result.push(cleanJsonObject(jsonObject));
    });

    converter.on('end_parsed', () => {
        var filePath = config.paths.tableData.replace('{0}', league.name).replace('{1}', year);

        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('File updated: ' + league.name + '/' + year);
            }
        });
    });

    var periodCode = getPeriodCode(year);
    var url = tableDataUrl.replace('{0}', periodCode).replace('{1}', league.code);
    request.get(url).pipe(converter);
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

// Gets the period code of a year (2001 -> 0102)
function getPeriodCode(year) {
    var part1 = ('00' + (year % 100)).slice(-2);
    var part2 = ('00' + ((year + 1) % 100)).slice(-2);

    return part1 + part2;
}

module.exports = {
    updateCurrent: updateCurrent,
    updateAll: updateAll
};