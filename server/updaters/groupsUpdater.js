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
function update(arg) {
    helper.runUpdate(itemsExtended, updateData, arg);
}

// Updates the results of an item
function updateData(item) {
    var results = [];

    for (var i = 0; i < item.groupNumber; i++) {
        results.push({ group: resultsDataUrlExtensions[i], matches: [], table: [] });
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

            var currentTable = results[groupIndex].table;

            $('#site > div.white > div.content > div > div:nth-child(7) > div > table.standard_tabelle > tr').each((index, elem) => {
                if (index > 0) {
                    currentTable.push({
                        rank: $(elem).find('td:nth-child(1)').text(),
                        team: $(elem).find('td:nth-child(3) > a').text(),
                        logoSrc: $(elem).find('td:nth-child(2) > img').attr('src'),
                        points: $(elem).find('td:nth-child(10)').text(),
                        played: $(elem).find('td:nth-child(4)').text(),
                        win: $(elem).find('td:nth-child(5)').text(),
                        draw: $(elem).find('td:nth-child(6)').text(),
                        lost: $(elem).find('td:nth-child(7)').text(),
                        goalsFor: $(elem).find('td:nth-child(8)').text().split(':')[0],
                        goalsAgainst: $(elem).find('td:nth-child(8)').text().split(':')[1],
                        goalDifference: $(elem).find('td:nth-child(9)').text()
                    });
                }
            });

            for (var i = 0; i < currentTable.length; i++) {
                helper.manageLogoProperty(currentTable[i]);
            }

            resolve();
        });
    });
}

module.exports = {
    update: update
};