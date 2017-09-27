'use strict';

var config = require('../config');
var helper = require('../helper');
var competitions = require('../data/competitions');

var resultsDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-gruppe-{2}';
var resultsDataUrlExtensions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
var competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', groupNumber: 8 },
    { item: competitions.europaLeague, url: 'europa-league', groupNumber: 12 }
];

// Updates results of current period
function update(competitionArg) {
    helper.runUpdate(competitionsExtended, updateData, competitionArg);
}

// Updates the results of an itemExtended
function updateData(itemExtended) {
    var results = [];
    var promises = [];

    for (var i = 0; i < itemExtended.groupNumber; i++) {
        results.push({ name: resultsDataUrlExtensions[i], matches: [], table: [] });
        promises.push(parseRound(itemExtended, results, i));
    }

    Promise.all(promises).then(() => {
        if (results.some(p => p.matches.length !== 12) || results.some(p => p.table.length !== 4)) {
            helper.log('Error while updating groups: ' + itemExtended.item.code);
            return;
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.groupsData, itemExtended.item.code, config.periods.current), results);
    });
}

// Parse a page of an itemExtended
function parseRound(itemExtended, results, groupIndex) {
    return new Promise((resolve) => {
        helper.scrapeUrl(helper.stringFormat(resultsDataUrl, itemExtended.url, config.periods.current, resultsDataUrlExtensions[groupIndex]), ($) => {
            var currentMatches = results[groupIndex].matches;
            var currentDate;

            $('#site > div.white > div.content > div > div:nth-child(4) > div > table tr').each((index, elem) => {
                if (index >= 12) {
                    return;
                }

                var isLiveScore = $(elem).find(' td:nth-child(6) > a > span').length;
                currentDate = $(elem).find('td:nth-child(1)').text() || currentDate;

                currentMatches.push({
                    date: currentDate,
                    homeTeam: $(elem).find('td:nth-child(3) > a').text(),
                    awayTeam: $(elem).find('td:nth-child(5) > a').text(),
                    score: isLiveScore ? '-:-' : ($(elem).find('td:nth-child(6) > a').text().split(' ')[0] || '-:-')
                });
            });

            for (var i = 0; i < currentMatches.length; i++) {
                currentMatches[i].homeTeamLogo = helper.stringSanitize(currentMatches[i].homeTeam);
                currentMatches[i].awayTeamLogo = helper.stringSanitize(currentMatches[i].awayTeam);
            }

            var currentTable = results[groupIndex].table;

            $('#site > div.white > div.content > div > div:nth-child(7) > div > table.standard_tabelle tr').each((index, elem) => {
                if (index <= 0) {
                    return;
                }

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
            });

            for (var j = 0; j < currentTable.length; j++) {
                helper.manageLogoProperty(currentTable[j]);
            }

            resolve();
        });
    });
}

module.exports = {
    update: update
};