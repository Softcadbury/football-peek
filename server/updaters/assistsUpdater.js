'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');
var competitions = require('../data/competitions');

var assistsDataUrl = 'http://www.worldfootball.net/assists/{0}-{1}';
var itemsExtended = [
    { code: leagues.bundesliga.code, url: 'bundesliga' },
    { code: leagues.liga.code, url: 'esp-primera-division' },
    { code: leagues.ligue1.code, url: 'fra-ligue-1' },
    { code: leagues.serieA.code, url: 'ita-serie-a' },
    { code: leagues.premierLeague.code, url: 'eng-premier-league' },
    { code: competitions.championsLeague.code, url: 'champions-league' },
    { code: competitions.europaLeague.code, url: 'europa-league' }
];

// Updates assists of current year
function update() {
    for (var i = 0; i < itemsExtended.length; i++) {
        updateData(itemsExtended[i]);
    }
}

// Updates the assists of a item
function updateData(item) {
    helper.scrapeUrl(helper.stringFormat(assistsDataUrl, item.url, config.years.current), function ($) {
        var results = [];

        $('#site > div.white > div.content > div > div.box > div > table > tr').each((index, elem) => {
            if (index > 0 && index <= 20) {
                results.push({
                    rank: $(elem).find('td:nth-child(1) > b').text() || '-',
                    name: $(elem).find(' td:nth-child(2) > a').text(),
                    country: $(elem).find('td:nth-child(4)').text(),
                    flagSrc: $(elem).find('td:nth-child(3) > img').attr('src'),
                    team: $(elem).find('td:nth-child(5) > a:nth-child(2)').text(),
                    logoSrc: $(elem).find('td:nth-child(5) > a:nth-child(1) > img').attr('src'),
                    goals: $(elem).find('td:nth-child(6) > b').text()
                });
            }
        });

        for (var i = 0; i < results.length; i++) {
            results[i].flag = helper.stringSanitize(results[i].country);
            helper.downloadImage('http:' + results[i].flagSrc, helper.stringFormat(config.paths.flagsData, results[i].flag));
            delete results[i].flagSrc;

            results[i].logo = helper.stringSanitize(results[i].team);
            helper.downloadImage('http:' + results[i].logoSrc, helper.stringFormat(config.paths.logosData, results[i].logo));
            delete results[i].logoSrc;
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.assistsData, item.code, config.years.current), results);
    });
}

module.exports = {
    update: update
};