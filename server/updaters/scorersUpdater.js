'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');
var competitions = require('../data/competitions');

var scorersDataUrl = 'http://www.worldfootball.net/goalgetter/{0}-{1}';
var itemsExtended = [
    { item: leagues.bundesliga, url: 'bundesliga' },
    { item: leagues.liga, url: 'esp-primera-division' },
    { item: leagues.ligue1, url: 'fra-ligue-1' },
    { item: leagues.serieA, url: 'ita-serie-a' },
    { item: leagues.premierLeague, url: 'eng-premier-league' }
];
var competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league' },
    { item: competitions.europaLeague, url: 'europa-league' }
];

// Updates scorers of current year
function update(leagueArg, competitionArg) {
    helper.runUpdate(itemsExtended, updateData, leagueArg);
    helper.runUpdate(competitionsExtended, updateData, competitionArg);
}

// Updates the scorers of a itemExtended
function updateData(itemExtended) {
    helper.scrapeUrl(helper.stringFormat(scorersDataUrl, itemExtended.url, config.years.current), function ($) {
        var results = [];

        $('#site > div.white > div.content > div > div.box > div > table > tr').each((index, elem) => {
            if (index > 0 && index <= 20) {
                results.push({
                    rank: $(elem).find('td:nth-child(1) > b').text() || '-',
                    name: $(elem).find(' td:nth-child(2) > a').text(),
                    country: $(elem).find('td:nth-child(4)').text(),
                    flagSrc: $(elem).find('td:nth-child(3) > img').attr('src'),
                    team: $(elem).find('td:nth-child(5) > a:nth-child(2)').text(),
                    logoSrc: $(elem).find('td:nth-child(5) > a:nth-child(1) > img').attr('src'),
                    goals: $(elem).find('td:nth-child(6) > b').text()
                });
            }
        });

        if (results.length < 2) {
            return;
        }

        for (var i = 0; i < results.length; i++) {
            helper.manageFlagProperty(results[i]);
            helper.manageLogoProperty(results[i]);
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.scorersData, itemExtended.item.code, config.years.current), results);
    });
}

module.exports = {
    update: update
};