'use strict';

var config = require('../config');
var helper = require('../helper');

var tableDataUrl = 'http://www.lequipe.fr/Football/{0}-classement.html';
var leagues = [
    { name: config.leagues.bundesliga, code: 'championnat-d-allemagne' },
    { name: config.leagues.liga, code: 'championnat-d-espagne' },
    { name: config.leagues.ligue1, code: 'ligue-1' },
    { name: config.leagues.serieA, code: 'championnat-d-italie' },
    { name: config.leagues.premierLeague, code: 'championnat-d-angleterre' }
];

// Updates tables of current year
function update() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i]);
    }
}

// Updates the table of a league
function updateData(league) {
    helper.scrapeUrl(helper.stringFormat(tableDataUrl, league.code), function($) {
        var result = [];

        $('#col-gauche > section > div.v6-page > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                result.push({
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

        helper.writeJsonFile(helper.stringFormat(config.paths.tableData, league.name), result);
    });
}

module.exports = {
    update: update
};