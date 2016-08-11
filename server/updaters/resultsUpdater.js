'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');

var resultsDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-spieltag/{2}';
var itemsExtended = [
    { code: leagues.bundesliga.code, url: 'bundesliga', roundNumber: 34 },
    { code: leagues.liga.code, url: 'esp-primera-division', roundNumber: 38 },
    { code: leagues.ligue1.code, url: 'fra-ligue-1', roundNumber: 38 },
    { code: leagues.serieA.code, url: 'ita-serie-a', roundNumber: 38 },
    { code: leagues.premierLeague.code, url: 'eng-premier-league', roundNumber: 38 },
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

    for (var i = 0; i < item.roundNumber; i++) {
        results.push({ round: i + 1, matches: [] });
    }

    var promises = [];

    for (var i = 0; i < item.roundNumber; i++) {
        promises.push(parseRound(item, results, i));
    }

    Promise.all(promises).then(() => {
        helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.years.current), results);
    });
}

// Parse a page of an item
function parseRound(item, results, round) {
    return new Promise((resolve, reject) => {
        helper.scrapeUrl(helper.stringFormat(resultsDataUrl, item.url, config.years.current, round + 1), function ($) {
            var currentMatches = results[round].matches;

            $('#site > div.white > div.content > div > div:nth-child(4) > div > table > tr').each((index, elem) => {
                if (index < (item.roundNumber + 2) / 4) {
                    currentMatches.push({
                        date: $(elem).find('td:nth-child(1)').text(),
                        homeTeam: $(elem).find('td:nth-child(3) > a').text(),
                        awayTeam: $(elem).find('td:nth-child(5) > a').text(),
                        score: $(elem).find('td:nth-child(6) > a').text().split(' ')[0]
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