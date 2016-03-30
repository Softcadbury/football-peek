'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../common/leagues');

var resultsDataUrl = 'http://www.lequipe.fr/Football/{0}.html';
var leaguesExtended = [
    { code: leagues.bundesliga.code, url: 'championnat-d-allemagne-resultats' },
    { code: leagues.liga.code, url: 'championnat-d-espagne-resultats' },
    { code: leagues.ligue1.code, url: 'ligue-1-resultats' },
    { code: leagues.serieA.code, url: 'championnat-d-italie-resultats' },
    { code: leagues.premierLeague.code, url: 'championnat-d-angleterre-resultats' }
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

        $('#CONT > div > h2 ').each((index, elem) => {
            console.log($(elem).html());
            // results.push({
            //     rank: $(elem).find('td[headers=rank]').text() || '-',
            //     name: $(elem).find('td[headers=player]').text(),
            //     team: $(elem).find('td[headers=team]').text(),
            //     goals: $(elem).find('td[headers=goals]').text()
            // });
        });

        helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, league.code), results);
    });
}

module.exports = {
    update: update
};