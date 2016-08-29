'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');
var competitions = require('../data/competitions');

var assistsDataUrl = 'http://www.worldfootball.net/assists/{0}-{1}{2}';
var leaguesExtended = [
    { item: leagues.bundesliga, url: 'bundesliga', extra: '' },
    { item: leagues.liga, url: 'esp-primera-division', extra: '_2' },
    { item: leagues.ligue1, url: 'fra-ligue-1', extra: '' },
    { item: leagues.serieA, url: 'ita-serie-a', extra: '' },
    { item: leagues.premierLeague, url: 'eng-premier-league', extra: '' }
];
var competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', extra: '' },
    { item: competitions.europaLeague, url: 'europa-league', extra: '' }
];

// Updates assists of current year
function update(leagueArg, competitionArg) {
    helper.runUpdate(leaguesExtended, updateData, leagueArg);
    helper.runUpdate(competitionsExtended, updateData, competitionArg);
}

// Updates the assists of an itemExtended
function updateData(itemExtended) {
    helper.scrapeUrl(helper.stringFormat(assistsDataUrl, itemExtended.url, config.years.current, itemExtended.extra), function ($) {
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
                    assists: $(elem).find('td:nth-child(6) > b').text()
                });
            }
        });

        if (results.length < 5) {
            console.log('Error while updating assists: ' + itemExtended.item.code)
            return;
        }

        for (var i = 0; i < results.length; i++) {
            helper.manageFlagProperty(results[i]);
            helper.manageLogoProperty(results[i]);
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.assistsData, itemExtended.item.code, config.years.current), results);
    });
}

module.exports = {
    update: update
};