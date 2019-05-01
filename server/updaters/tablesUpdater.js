'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');

var tableDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-spieltag{2}';
var leaguesExtended = [
    { item: leagues.bundesliga, url: 'bundesliga', extra: '' },
    { item: leagues.liga, url: 'esp-primera-division', extra: '' },
    { item: leagues.ligue1, url: 'fra-ligue-1', extra: '' },
    { item: leagues.serieA, url: 'ita-serie-a', extra: '' },
    { item: leagues.premierLeague, url: 'eng-premier-league', extra: '' }
];

function update(item) {
    var itemExtended = leaguesExtended.find(p => p.item === item);

    return new Promise(resolve => {
        helper.scrapeUrl(helper.stringFormat(tableDataUrl, itemExtended.url, config.periods.current, itemExtended.extra), $ => {
            var results = [];

            $('#site > div.white > div.content > div > div:nth-child(7) > div > table.standard_tabelle tr').each((index, elem) => {
                if (index <= 0) {
                    return;
                }

                results.push({
                    rank: $(elem).find('td:nth-child(1)').text(),
                    team: $(elem).find('td:nth-child(3) > a').text(),
                    logoSrc: $(elem).find('td:nth-child(2) > img').attr('src'),
                    points: $(elem).find('td:nth-child(10)').text(),
                    played: $(elem).find('td:nth-child(4)').text(),
                    win: $(elem).find('td:nth-child(5)').text(),
                    draw: $(elem).find('td:nth-child(6)').text(),
                    lost: $(elem).find('td:nth-child(7)').text(),
                    goalsFor: $(elem).find('td:nth-child(8)').text().split(':')[0],
                    goalsAgainst: $(elem).find('td:nth-child(8)').text().split(':')[1],
                    goalDifference: $(elem).find('td:nth-child(9)').text()
                });
            });

            if (results.length < 18) {
                helper.log('Error while updating table: ' + itemExtended.item.code);
                return;
            }

            for (var i = 0; i < results.length; i++) {
                helper.manageLogoProperty(results[i]);
            }

            helper.writeJsonFile(helper.stringFormat(config.paths.tableData, itemExtended.item.code, config.periods.current), results, resolve);
        });
    });
}

module.exports = {
    update: update
};