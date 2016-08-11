'use strict';

var config = require('../config');
var helper = require('../helper');
var competitions = require('../data/competitions');

var resultsDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-gruppe-{2}';
var resultsDataUrlExtensions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
var itemsExtended = [
    { code: competitions.championsLeague.code, url: 'champions-league', groupNumber: 8 },
    { code: competitions.europaLeague.code, url: 'europa-league', groupNumber: 12 }
];

// Updates results of current year
function update() {
    for (var i = 0; i < itemsExtended.length; i++) {
        updateData(itemsExtended[i]);
    }
}

// Updates the results of an item
function updateData(item) {
    var results = [];

    for (var i = 0; i < item.groupNumber; i++) {
        results.push({ group: resultsDataUrlExtensions[i], matches: [] });
    }

    var promises = [];

    for (var i = 0; i < item.groupNumber; i++) {
        promises.push(parseRound(item, results, i));
    }

    Promise.all(promises).then(() => {
        helper.writeJsonFile(helper.stringFormat(config.paths.groupsData, item.code, config.years.current), results);
    });
}

// Parse a page of an item
function parseRound(item, results, groupIndex) {
    return new Promise((resolve, reject) => {
        helper.scrapeUrl(helper.stringFormat(resultsDataUrl, item.url, config.years.current, resultsDataUrlExtensions[groupIndex]), function ($) {
            var currentMatches = results[groupIndex].matches;

            $('#site > div.white > div.content > div > div:nth-child(4) > div > table > tr').each((index, elem) => {
                currentMatches.push({
                    date: $(elem).find('td:nth-child(1)').text(),
                    homeTeam: $(elem).find('td:nth-child(3) > a').text(),
                    awayTeam: $(elem).find('td:nth-child(5) > a').text(),
                    score: $(elem).find('td:nth-child(6) > a').text().split(' ')[0] || '-:-'
                });
            });

            for (var i = 0; i < currentMatches.length; i++) {
                currentMatches[i].homeTeamLogo = helper.stringSanitize(currentMatches[i].homeTeam);
                currentMatches[i].awayTeamLogo = helper.stringSanitize(currentMatches[i].awayTeam);
            }

            resolve();
        });
    });
}

module.exports = {
    update: update
};