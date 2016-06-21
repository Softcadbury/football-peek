'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');
var competitions = require('../data/competitions');

var scorersDataUrl = 'http://www.lequipe.fr/Football/{0}.html';
var itemsExtended = [
    { code: leagues.bundesliga.code, url: 'FootballClassementChampionnat2297_BUT_1' },
    { code: leagues.liga.code, url: 'FootballClassementChampionnat2301_BUT_1' },
    { code: leagues.ligue1.code, url: 'FootballClassementChampionnat2282_BUT_1' },
    { code: leagues.serieA.code, url: 'FootballClassementChampionnat2303_BUT_1' },
    { code: leagues.premierLeague.code, url: 'FootballClassementChampionnat2281_BUT_1' },
    { code: competitions.championsLeague.code, url: 'ligue-des-champions-classement-buteurs' },
    { code: competitions.europaLeague.code, url: 'ligue-europa-classement-buteurs' }
];

// Updates scorers of current year
function update() {
    for (var i = 0; i < itemsExtended.length; i++) {
        updateData(itemsExtended[i]);
    }
}

// Updates the scorers of a item
function updateData(item) {
    helper.scrapeUrl(helper.stringFormat(scorersDataUrl, item.url), function ($) {
        var results = [];

        // Gets results
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

        helper.writeJsonFile(helper.stringFormat(config.paths.scorersData, item.code, config.currentYear), results);
    });
}

module.exports = {
    update: update
};