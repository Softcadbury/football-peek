'use strict';

const config = require('../config');
const helper = require('../helper');
const leagues = require('../data/leagues');
const competitions = require('../data/competitions');

const assistsDataUrl = 'https://www.worldfootball.net/assists/{0}-{1}{2}';
const leaguesExtended = [
    { item: leagues.bundesliga, url: 'bundesliga', extra: '' },
    { item: leagues.liga, url: 'esp-primera-division', extra: '' },
    { item: leagues.ligue1, url: 'fra-ligue-1', extra: '' },
    { item: leagues.serieA, url: 'ita-serie-a', extra: '' },
    { item: leagues.premierLeague, url: 'eng-premier-league', extra: '' }
];
const competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', extra: '' },
    { item: competitions.europaLeague, url: 'europa-league', extra: '' }
];

async function updateLeagues(item) {
    const itemExtended = leaguesExtended.find(p => p.item === item);
    return await update(itemExtended);
}

async function updateCompetitions(item) {
    const itemExtended = competitionsExtended.find(p => p.item === item);
    return await update(itemExtended);
}

function update(itemExtended) {
    return new Promise(resolve => {
        helper.scrapeUrl(helper.stringFormat(assistsDataUrl, itemExtended.url, config.periods.current, itemExtended.extra), $ => {
            const results = [];

            $('#site > div.white > div.content > div > div.box > div > table tr').each((index, elem) => {
                if (index <= 0 || index > 20) {
                    resolve();
                    return;
                }

                results.push({
                    rank: $(elem).find('td:nth-child(1) > b').text() || '-',
                    name: $(elem).find(' td:nth-child(2) > a').text(),
                    country: $(elem).find('td:nth-child(4)').text(),
                    flagSrc: $(elem).find('td:nth-child(3) > img').attr('src'),
                    team: $(elem).find('td:nth-child(5) > a:nth-last-child(1)').text(),
                    logoSrc: $(elem).find('td:nth-child(5) > a:nth-last-child(2) > img').attr('src'),
                    assists: $(elem).find('td:nth-child(6) > b').text()
                });
            });

            if (results.length < 5) {
                helper.log('Error while updating assists: ' + itemExtended.item.code);
                resolve();
                return;
            }

            for (let i = 0; i < results.length; i++) {
                helper.manageFlagProperty(results[i]);
                helper.manageLogoProperty(results[i]);
            }

            helper.writeJsonFile(helper.stringFormat(config.paths.assistsData, itemExtended.item.code, config.periods.current), results, resolve);
        });
    });
}

module.exports = {
    updateLeagues,
    updateCompetitions
};