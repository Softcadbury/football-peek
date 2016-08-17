'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../data/leagues');

var tableDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-spieltag{2}';
var itemsExtended = [
    { code: leagues.bundesliga.code, url: 'bundesliga', extra: '' },
    { code: leagues.liga.code, url: 'esp-primera-division', extra: '_2' },
    { code: leagues.ligue1.code, url: 'fra-ligue-1', extra: '' },
    { code: leagues.serieA.code, url: 'ita-serie-a', extra: '' },
    { code: leagues.premierLeague.code, url: 'eng-premier-league', extra: '' }
];

// Updates tables of current year
function update(arg) {
    helper.runUpdate(itemsExtended, updateData, arg);
}

// Updates the table of an item
function updateData(item) {
    helper.scrapeUrl(helper.stringFormat(tableDataUrl, item.url, config.years.current, item.extra), function ($) {
        var results = [];

        $('#site > div.white > div.content > div > div:nth-child(7) > div > table.standard_tabelle > tr').each((index, elem) => {
            if (index > 0) {
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
            }
        });

        for (var i = 0; i < results.length; i++) {
            helper.manageLogoProperty(results[i]);
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.tableData, item.code, config.years.current), results);
    });
}

module.exports = {
    update: update
};