'use strict';

const config = require('../config');
const helper = require('../helper');
const leagues = require('../data/leagues');

const resultsDataUrl = 'https://www.worldfootball.net/schedule/{0}-{1}-spieltag{2}/{3}';
const leaguesExtended = [
    { item: leagues.bundesliga, url: 'bundesliga', extra: '', roundNumber: 34 },
    { item: leagues.liga, url: 'esp-primera-division', extra: '', roundNumber: 38 },
    { item: leagues.ligue1, url: 'fra-ligue-1', extra: '', roundNumber: 38 },
    { item: leagues.serieA, url: 'ita-serie-a', extra: '', roundNumber: 38 },
    { item: leagues.premierLeague, url: 'eng-premier-league', extra: '', roundNumber: 38 }
];

function update(item) {
    const itemExtended = leaguesExtended.find(p => p.item === item);
    let results = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, itemExtended.item.code, config.periods.current));
    const promises = [];

    if (config.updateWithFullResults || !results.length) {
        results = [];

        for (let i = 0; i < itemExtended.roundNumber; i++) {
            results.push({ round: i + 1, matches: [] });
            promises.push(parseRound(itemExtended, results, i));
        }
    } else {
        const currentRound = helper.getLeagueCurrentRound(results);
        const maxRound = Math.min(itemExtended.roundNumber, currentRound + 1);

        for (let j = currentRound - 1; j < maxRound; j++) {
            promises.push(parseRound(itemExtended, results, j));
        }
    }

    return new Promise(resolve => {
        Promise.all(promises).then(() => {
            if (results.some(p => p.matches.length < 9)) {
                helper.log('Error while updating result: ' + itemExtended.item.code);
                resolve();
                return;
            }

            helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, itemExtended.item.code, config.periods.current), results, resolve);
        });
    });
}

// Parse a page of an itemExtended
function parseRound(itemExtended, results, roundIndex) {
    return new Promise(resolve => {
        helper.scrapeUrl(helper.stringFormat(resultsDataUrl, itemExtended.url, config.periods.current, itemExtended.extra, roundIndex + 1), $ => {
            const currentMatches = results[roundIndex].matches;
            currentMatches.splice(0, currentMatches.length);
            let currentDate;

            $('#site > div.white > div.content > div > div:nth-child(4) > div > table tr').each((index, elem) => {
                if (index >= (itemExtended.roundNumber + 2) / 4) {
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

            resolve();
        });
    });
}

module.exports = {
    update
};