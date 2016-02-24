'use strict';

var config = require('../config');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var scorerDataUrl = 'http://www.lequipe.fr/Football/FootballClassementChampionnat{0}_BUT_1.html';
var league = [
    { country: 'England', code: '2281' },
    { country: 'France', code: '2282' },
    { country: 'Germany', code: '2297' },
    { country: 'Italy', code: '2303' },
    { country: 'Spain', code: '2301' }
];

// Updates scorers of current year
function updateCurrent() {
    var period = '2015-2016';

    for (var i = 0; i < league.length; i++) {
        updateData(league[i], period);
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
                    name: $(elem).find('td.rang').text(),
                    rank: $(elem).find('td.player > a').text(),
                    team: $(elem).find('td.player > span > a').text(),
                    goals: $(elem).find('td:nth-child(3)').text()
                });
            }
        });

        var filePath = config.scorerDataPath.replace('{0}', league.country).replace('{1}', period);

        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('File updated: ' + league.country + '-' + period);
            }
        });
    });
}

module.exports = {
    updateCurrent: updateCurrent
};