'use strict';

var config = require('../config');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var scorersDataUrl = 'http://www.lequipe.fr/Football/FootballClassementChampionnat{0}_BUT_1.html';
var leagues = [
    { name: config.leagues.bundesliga, code: '2297' },
    { name: config.leagues.liga, code: '2301' },
    { name: config.leagues.ligue1, code: '2282' },
    { name: config.leagues.serieA, code: '2303' },
    { name: config.leagues.premierLeague, code: '2281' }
];

// Updates scorers of current year
function update() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i]);
    }
}

// Updates the scorers of a league
function updateData(league) {
    var url = scorersDataUrl.replace('{0}', league.code);

    request(url, (err, resp, body) => {
        if (err) {
            throw err;
        }

        var $ = cheerio.load(body);
        var result = [];

        $('#col-gauche > section > div > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                result.push({
                    rank: $(elem).find('td.rang').text(),
                    name: $(elem).find('td.player > a').text(),
                    team: $(elem).find('td.player > span > a').text(),
                    goals: $(elem).find('td.stat').not('.stat-large').not('.stat-xlarge').text(),
                    played: $(elem).find('td.stat-large').text()
                });
            }
        });

        var filePath = config.paths.scorersData.replace('{0}', league.name);
        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Scorers updated for ' + league.name);
            }
        });
    });
}

module.exports = {
    update: update
};