'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');

var resultsDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-spieltag{2}/{3}';
var leaguesExtended = [
    { item: leagues.bundesliga, url: 'bundesliga', extra: '', roundNumber: 34 },
    { item: leagues.liga, url: 'esp-primera-division', extra: '_2', roundNumber: 38 },
    { item: leagues.ligue1, url: 'fra-ligue-1', extra: '', roundNumber: 38 },
    { item: leagues.serieA, url: 'ita-serie-a', extra: '', roundNumber: 38 },
    { item: leagues.premierLeague, url: 'eng-premier-league', extra: '', roundNumber: 38 },
];

// Updates results of current year
function update(leagueArg) {
    helper.runUpdate(leaguesExtended, updateData, leagueArg);
}

// Updates the results of an itemExtended
function updateData(itemExtended) {
    var results = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, itemExtended.item.code, config.years.current));
    var promises = [];

    if (!results.length) {
        for (var i = 0; i < itemExtended.roundNumber; i++) {
            results.push({ round: i + 1, matches: [] });
            promises.push(parseRound(itemExtended, results, i));
        }
    } else {
        var currentRound = helper.getLeagueCurrentRound(results);
        var maxRound = Math.min(itemExtended.roundNumber, currentRound + 1);

        for (var i =  currentRound - 1; i < maxRound; i++) {
            promises.push(parseRound(itemExtended, results, i));
        }
    }

    Promise.all(promises).then(() => {
        if (results.some(p => p.matches.length < 9)) {
            console.log('Error while updating result: ' + itemExtended.item.code);
            return;
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, itemExtended.item.code, config.years.current), results);
    });
}

// Parse a page of an itemExtended
function parseRound(itemExtended, results, roundIndex) {
    return new Promise((resolve, reject) => {
        helper.scrapeUrl(helper.stringFormat(resultsDataUrl, itemExtended.url, config.years.current, itemExtended.extra, roundIndex + 1), function ($) {
            var currentMatches = results[roundIndex].matches;
            currentMatches.splice(0, currentMatches.length);

            $('#site > div.white > div.content > div > div:nth-child(4) > div > table > tr').each((index, elem) => {
                if (index < (itemExtended.roundNumber + 2) / 4) {
                    var isLiveScore = $(elem).find(' td:nth-child(6) > a > span').length;

                    currentMatches.push({
                        date: $(elem).find('td:nth-child(1)').text(),
                        homeTeam: $(elem).find('td:nth-child(3) > a').text(),
                        awayTeam: $(elem).find('td:nth-child(5) > a').text(),
                        score: isLiveScore ? '-:-' : ($(elem).find('td:nth-child(6) > a').text().split(' ')[0] || '-:-')
                    });
                }
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