'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');

var resultsDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-spieltag';
var itemsExtended = [
    { code: leagues.bundesliga.code, url: 'bundesliga' },
    { code: leagues.liga.code, url: 'esp-primera-division' },
    { code: leagues.ligue1.code, url: 'fra-ligue-1' },
    { code: leagues.serieA.code, url: 'ita-serie-a' },
    { code: leagues.premierLeague.code, url: 'eng-premier-league' },
];

// Updates results of current year
function update() {
    for (var i = 0; i < itemsExtended.length; i++) {
        updateData(itemsExtended[i]);
    }
}

// Updates the results of an item
function updateData(item) {
    helper.scrapeUrl(helper.stringFormat(resultsDataUrl, item.url, config.years.current), function ($) {
        var results = [];

        $('#site > div.white > div.content > div > div:nth-child(4) > div > table > tr').each((index, elem) => {
            results.push({
                date: $(elem).find('td:nth-child(1)').text(),
                homeTeam: $(elem).find('td:nth-child(3) > a').text(),
                awayTeam: $(elem).find('td:nth-child(5) > a').text(),
                score: $(elem).find('td:nth-child(6) > a').text().split(' ')[0]
            });
        });

        for (var i = 0; i < results.length; i++) {
            results[i].homeTeamLogo = helper.stringSanitize(results[i].homeTeam);
            results[i].awayTeamLogo = helper.stringSanitize(results[i].awayTeam);
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.years.current), results);
    });
}

module.exports = {
    update: update
};