'use strict';

var config = require('../config');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Updates scorers of current year
function updateCurrent() {
    var url = 'http://www.lequipe.fr/Football/FootballClassementChampionnat2281_BUT_1.html';

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

        var country = 'England';
        var period = '2015-2016';
        var filePath = config.scorerDataPath.replace('{0}', country).replace('{1}', period);

        fs.writeFile(filePath, JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('File updated: ' + country + '-' + period);
            }
        });
    });
}

module.exports = {
    updateCurrent: updateCurrent
};