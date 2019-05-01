'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');
var competitions = require('../data/competitions');

var scorersDataUrl = 'http://www.worldfootball.net/goalgetter/{0}-{1}{2}';
var leaguesExtended = [
    { item: leagues.bundesliga, url: 'bundesliga', extra: '' },
    { item: leagues.liga, url: 'esp-primera-division', extra: '' },
    { item: leagues.ligue1, url: 'fra-ligue-1', extra: '' },
    { item: leagues.serieA, url: 'ita-serie-a', extra: '' },
    { item: leagues.premierLeague, url: 'eng-premier-league', extra: '' }
];
var competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', extra: '' },
    { item: competitions.europaLeague, url: 'europa-league', extra: '' }
];

function updateLeagues(item) {
    var itemExtended = leaguesExtended.find(p => p.item === item);
    return update(itemExtended);
}

function updateCompetitions(item) {
    var itemExtended = competitionsExtended.find(p => p.item === item);
    return update(itemExtended);
}

function update(itemExtended) {
    return new Promise(resolve => {
        helper.scrapeUrl(helper.stringFormat(scorersDataUrl, itemExtended.url, config.periods.current, itemExtended.extra), $ => {
            var results = [];

            $('#site > div.white > div.content > div > div.box > div > table tr').each((index, elem) => {
                if (index <= 0 || index > 20) {
                    return;
                }

                results.push({
                    rank: $(elem).find('td:nth-child(1) > b').text() || '-',
                    name: $(elem).find(' td:nth-child(2) > a').text(),
                    country: $(elem).find('td:nth-child(4)').text(),
                    flagSrc: $(elem).find('td:nth-child(3) > img').attr('src'),
                    team: $(elem).find('td:nth-child(5) > a:nth-last-child(1)').text(),
                    logoSrc: $(elem).find('td:nth-child(5) > a:nth-last-child(2) > img').attr('src'),
                    goals: $(elem).find('td:nth-child(6) > b').text()
                });
            });

            if (results.length < 5) {
                helper.log('Error while updating scorers: ' + itemExtended.item.code);
                return;
            }

            for (var i = 0; i < results.length; i++) {
                helper.manageFlagProperty(results[i]);
                helper.manageLogoProperty(results[i]);
            }

            helper.writeJsonFile(helper.stringFormat(config.paths.scorersData, itemExtended.item.code, config.periods.current), results, resolve);
        });
    });
}

module.exports = {
    updateLeagues: updateLeagues,
    updateCompetitions: updateCompetitions
};