'use strict';

var config = require('../config');
var helper = require('../helper');

var tableDataUrl = 'http://www.lequipe.fr/Football/{0}-classement.html';
var leagues = [
    { code: config.leagues.bundesliga.code, url: 'championnat-d-allemagne' },
    { code: config.leagues.liga.code, url: 'championnat-d-espagne' },
    { code: config.leagues.ligue1.code, url: 'ligue-1' },
    { code: config.leagues.serieA.code, url: 'championnat-d-italie' },
    { code: config.leagues.premierLeague.code, url: 'championnat-d-angleterre' }
];

// Updates tables of current year
function update() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i]);
    }
}

// Updates the table of a league
function updateData(league) {
    helper.scrapeUrl(helper.stringFormat(tableDataUrl, league.url), function($) {
        var results = [];

        $('#col-gauche > section > div.v6-page > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                results.push({
                    rank: $(elem).find('td.rang').text(),
                    team: $(elem).find('td.team .team-label').text(),
                    points: $(elem).find('td.points').text(),
                    played: $(elem).find('td:nth-child(6)').text(),
                    win: $(elem).find('td:nth-child(7)').text(),
                    draw: $(elem).find('td:nth-child(8)').text(),
                    lost: $(elem).find('td:nth-child(9)').text(),
                    goalsFor: $(elem).find('td:nth-child(10)').text(),
                    goalsAgainst: $(elem).find('td:nth-child(11)').text(),
                    goalDifference: $(elem).find('td:nth-child(12)').text()
                });
            }
        });

        helper.writeJsonFile(helper.stringFormat(config.paths.tableData, league.code), results);
    });
}

module.exports = {
    update: update
};