'use strict';

var config = require('../config');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

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
    var url = tableDataUrl.replace('{0}', league.code);

    request(url, (err, resp, body) => {
        if (err) {
            throw err;
        }

        var $ = cheerio.load(body);
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

        var filePath = config.paths.tableData.replace('{0}', league.name);
        fs.writeFile(filePath, JSON.stringify(result, null, 4), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Table updated for ' + league.name);
            }
        });
    });
}

module.exports = {
    update: update
};