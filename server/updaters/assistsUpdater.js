'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');

var assistsDataUrl = 'http://www.espnfc.com/{0}/statistics/assists';
var leaguesExtended = [
    { code: leagues.bundesliga.code, url: 'german-bundesliga/10' },
    { code: leagues.liga.code, url: 'spanish-primera-division/15' },
    { code: leagues.ligue1.code, url: 'french-ligue-1/9' },
    { code: leagues.serieA.code, url: 'italian-serie-a/12' },
    { code: leagues.premierLeague.code, url: 'barclays-premier-league/23' }
];

// Updates assists of current year
function update() {
    for (var i = 0; i < leaguesExtended.length; i++) {
        updateData(leaguesExtended[i]);
    }
}

// Updates the assists of a league
function updateData(league) {
    helper.scrapeUrl(helper.stringFormat(assistsDataUrl, league.url), function($) {
        var results = [];

        $('#stats-top-assists > div > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                results.push({
                    rank: $(elem).find('td[headers=rank]').text() || '-',
                    name: $(elem).find('td[headers=player]').text(),
                    team: $(elem).find('td[headers=team]').text(),
                    goals: $(elem).find('td[headers=goals]').text()
                });
            }
        });

        helper.writeJsonFile(helper.stringFormat(config.paths.assistsData, league.code), results);
    });
}

module.exports = {
    update: update
};