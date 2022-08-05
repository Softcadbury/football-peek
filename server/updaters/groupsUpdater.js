'use strict';

const config = require('../config');
const helper = require('../helper');
const competitions = require('../data/competitions');

const resultsDataUrl = 'https://www.worldfootball.net/schedule/{0}-{1}-gruppe-{2}';
const resultsDataUrlExtensions = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', groupNumber: 8 },
    { item: competitions.europaLeague, url: 'europa-league', groupNumber: 8 }
];

function update(item) {
    const itemExtended = competitionsExtended.find(p => p.item === item);
    const results = [];
    const promises = [];

    for (let i = 0; i < itemExtended.groupNumber; i++) {
        results.push({ name: resultsDataUrlExtensions[i], matches: [], table: [] });
        promises.push(parseRound(itemExtended, results, i));
    }

    return new Promise(resolve => {
        Promise.all(promises).then(() => {
            if (results.some(p => p.matches.length !== 12) || results.some(p => p.table.length !== 4)) {
                helper.log('Error while updating groups: ' + itemExtended.item.code);
                resolve();
                return;
            }

            helper.writeJsonFile(helper.stringFormat(config.paths.groupsData, itemExtended.item.code, config.periods.current), results, resolve);
        });
    });
}

// Parse a page of an itemExtended
function parseRound(itemExtended, results, groupIndex) {
    return new Promise(resolve => {
        helper.scrapeUrl(helper.stringFormat(resultsDataUrl, itemExtended.url, config.periods.current, resultsDataUrlExtensions[groupIndex]), $ => {
            const currentMatches = results[groupIndex].matches;
            let currentDate;

            $('#site > div.white > div.content > div > div:nth-child(4) > div > table tr').each((index, elem) => {
                if (index >= 12) {
                    return;
                }

                const isLiveScore = $(elem).find(' td:nth-child(6) > a > span').length;
                currentDate = $(elem).find('td:nth-child(1)').text() || currentDate;

                currentMatches.push({
                    date: currentDate,
                    time: $(elem).find('td:nth-child(2)').text(),
                    homeTeam: $(elem).find('td:nth-child(3) > a').text(),
                    awayTeam: $(elem).find('td:nth-child(5) > a').text(),
                    score: isLiveScore ? '-:-' : ($(elem).find('td:nth-child(6) > a').text().split(' ')[0] || '-:-')
                });
            });

            for (let i = 0; i < currentMatches.length; i++) {
                currentMatches[i].homeTeamLogo = helper.stringSanitize(currentMatches[i].homeTeam);
                currentMatches[i].awayTeamLogo = helper.stringSanitize(currentMatches[i].awayTeam);
            }

            const currentTable = results[groupIndex].table;

            $('#site > div.white > div.content > div > div:nth-child(7) > div > table.standard_tabelle tr').each((index, elem) => {
                if (index <= 0) {
                    return;
                }

                currentTable.push({
                    rank: $(elem).find('td:nth-child(1)').text(),
                    team: $(elem).find('td:nth-child(3) > a').text(),
                    logoSrc: $(elem).find('td:nth-child(2)').text(),
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

            for (let j = 0; j < currentTable.length; j++) {
                helper.manageLogoProperty(currentTable[j]);
            }

            resolve();
        });
    });
}

module.exports = {
    update
};