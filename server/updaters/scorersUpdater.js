'use strict';

var config = require('../config');
var helper = require('../helper');

var scorersDataUrl = 'http://www.lequipe.fr/Football/FootballClassementChampionnat{0}_BUT_1.html';
var leagues = [
    { code: config.leagues.bundesliga.code, url: '2297' },
    { code: config.leagues.liga.code, url: '2301' },
    { code: config.leagues.ligue1.code, url: '2282' },
    { code: config.leagues.serieA.code, url: '2303' },
    { code: config.leagues.premierLeague.code, url: '2281' }
];

// Updates scorers of current year
function update() {
    for (var i = 0; i < leagues.length; i++) {
        updateData(leagues[i]);
    }
}

// Updates the scorers of a league
function updateData(league) {
    helper.scrapeUrl(helper.stringFormat(scorersDataUrl, league.url), function($) {
        var results = [];

        $('#col-gauche > section > div > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                results.push({
                    rank: $(elem).find('td.rang').text(),
                    name: $(elem).find('td.player > div > span > span > span > a').text(),
                    team: $(elem).find('td.player > div > span > span > span > span').text(),
                    goals: $(elem).find('td.stat.stat-large.highlighted').text(),
                    played: $(elem).find('td:nth-child(4)').text()
                });
            }
        });

        helper.writeJsonFile(helper.stringFormat(config.paths.scorersData, league.code), results);
    });
}

module.exports = {
    update: update
};