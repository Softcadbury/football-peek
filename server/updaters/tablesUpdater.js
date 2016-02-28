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
function updateCurrent() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i], config.currentYear);
    }
}

// Updates the table of a league and a period
function updateData(league, period) {
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
                    points: $(elem).find('td.points').text()
                });
            }
        });

        var filePath = config.paths.tablesData.replace('{0}', league.name).replace('{1}', period);
        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('table updated: ' + league.name + '/' + period);
            }
        });
    });
}

module.exports = {
    updateCurrent: updateCurrent
};