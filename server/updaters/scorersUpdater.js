'use strict';

var config = require('../config');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var scorerDataUrl = 'http://www.lequipe.fr/Football/FootballClassementChampionnat{0}_BUT_1.html';
var leagues = [
    { name: config.leagues.bundesliga, code: '2297' },
    { name: config.leagues.liga, code: '2301' },
    { name: config.leagues.ligue1, code: '2282' },
    { name: config.leagues.serieA, code: '2303' },
    { name: config.leagues.premierLeague, code: '2281' }
];

// Updates scorers of current year
function updateCurrent() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i], config.currentYear);
    }
}

// Updates the scorer of a league and a period
function updateData(league, period) {
    var url = scorerDataUrl.replace('{0}', league.code);

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

        var filePath = config.paths.scorerData.replace('{0}', league.name).replace('{1}', period);
        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('File updated: ' + league.name + '/' + period);
            }
        });
    });
}

module.exports = {
    updateCurrent: updateCurrent
};