'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../common/leagues');

var resultsDataUrl = 'http://www.football.fr/football/{0}/resultats.html';
var leaguesExtended = [
    { code: leagues.bundesliga.code, url: 'allemagne' },
    { code: leagues.liga.code, url: 'espagne' },
    { code: leagues.ligue1.code, url: 'ligue-1' },
    { code: leagues.serieA.code, url: 'italie' },
    { code: leagues.premierLeague.code, url: 'angleterre' }
];

// Updates results of current year
function update() {
    for (var i = 0; i < leaguesExtended.length; i++) {
        updateData(leaguesExtended[i]);
    }
}

// Updates the results of a league
function updateData(league) {
    helper.scrapeUrl(helper.stringFormat(resultsDataUrl, league.url), function($) {
        var results = [];
        var currentDate;

        $('.results tr').each((index, elem) => {
            if ($(elem).hasClass('white')) {
                currentDate = $(elem).find('td').text();
            } else if (!$(elem).hasClass('hidden')) {
                results.push({
                    date: currentDate,
                    homeTeam: $(elem).find('.team1 .name').text(),
                    awayTeam: $(elem).find('.team2 .name').text(),
                    score: $(elem).find('.score a').text()
                });
            }
        });

        helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, league.code), results);
    });
}

module.exports = {
    update: update
};