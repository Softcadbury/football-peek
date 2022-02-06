'use strict';

const config = require('../config');
const helper = require('../helper');
const competitions = require('../data/competitions');

const tournamentDataUrl = 'https://www.worldfootball.net/schedule/{0}-{1}-{2}';
const tournamentDataUrlExtensions = ['finale', 'halbfinale', 'viertelfinale', 'achtelfinale', 'sechzehntelfinale'];
const tournamentDataUrlExtensionsNames = ['Final', 'Semi-finals', 'Quarter-finals', 'Eighth-finals', 'Sixteenth-finals'];
const competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', roundNumber: 4 },
    { item: competitions.europaLeague, url: 'europa-league', roundNumber: 4, hasPlayOffs: true, playsOffMatches: 8 }
];

function update(item) {
    const itemExtended = competitionsExtended.find(p => p.item === item);
    const results = [];
    const promises = [];

    for (let i = 0; i < itemExtended.roundNumber; i++) {
        results.push({ name: tournamentDataUrlExtensionsNames[i], matches: [] });
        promises.push(parseRound(itemExtended, results, i));
    }

    if (itemExtended.hasPlayOffs) {
        results.push({ name: 'Play-offs', matches: [] });
        promises.push(parseRound(itemExtended, results, 4, true));
    }

    return new Promise(resolve => {
        Promise.all(promises).then(() => {
            const expectedMatches = itemExtended.hasPlayOffs ? itemExtended.playsOffMatches : itemExtended.roundNumber === 4 ? 8 : 16
            const lastMatchIndex = itemExtended.hasPlayOffs ? itemExtended.roundNumber : itemExtended.roundNumber === 4 ? 3 : 4

            if (results[lastMatchIndex].matches.length !== expectedMatches || !results[lastMatchIndex].matches[0].team1) {
                helper.log(
                    `Error while updating tournament: ${itemExtended.item.code}. ` +
                    `Expected matches count is ${expectedMatches}, found ${results[lastMatchIndex].matches.length}. ` +
                    `First team is: '${results[lastMatchIndex].matches[0].team1}'`);
                resolve();
                return;
            }

            // Remove empty phases
            for (let j = results.length - 1; j >= 0; j--) {
                if (!results[j].matches[0] || !results[j].matches[0].team1) {
                    results.splice(j, 1);
                }
            }

            helper.writeJsonFile(helper.stringFormat(config.paths.tournamentData, itemExtended.item.code, config.periods.current), results, resolve);
        });
    });
}

// Parse a page of an itemExtended
function parseRound(itemExtended, results, roundIndex, hasPlayOffs) {
    return new Promise(resolve => {
        const urlExtension = hasPlayOffs ? 'playoffs' : tournamentDataUrlExtensions[roundIndex];
        const numberOfMatches = hasPlayOffs ? itemExtended.playsOffMatches * 4 : Math.pow(2, roundIndex + 2);

        helper.scrapeUrl(helper.stringFormat(tournamentDataUrl, itemExtended.url, config.periods.current, urlExtension), $ => {
            const currentMatches = results[roundIndex].matches;

            $('#site > div.white > div.content > div > div.box > div > table tr').each((index, elem) => {
                if (index >= numberOfMatches) {
                    return;
                }

                if (roundIndex === 0) {
                    parseFinalPhase($, elem, currentMatches, index);
                } else {
                    parsePhaseOtherThanFinal($, elem, currentMatches, index);
                }
            });

            for (let i = 0; i < currentMatches.length; i++) {
                currentMatches[i].team1Logo = helper.stringSanitize(currentMatches[i].team1);
                currentMatches[i].team2Logo = helper.stringSanitize(currentMatches[i].team2);
            }

            resolve();
        });
    });
}

function parseFinalPhase($, elem, currentMatches, index) {
    if (index !== 0) {
        return;
    }

    const team1 = $(elem).find('td:nth-child(3) > a').text();
    const team2 = $(elem).find('td:nth-child(5) > a').text();
    const score = parseScore($(elem).find('td:nth-child(6) > a').text());
    const finalScore = score.split(' ').length === 1 ? score : score.split(' ')[1].replace('(', '').replace(')', '');
    let winner = '';

    if (finalScore !== '-:-') {
        winner = finalScore.split(':')[0] > finalScore.split(':')[1] ? team1 : team2;
    }

    currentMatches.push({
        date1: $(elem).find('td:nth-child(1)').text(),
        time1: $(elem).find('td:nth-child(2)').text(),
        team1: team1,
        team2: team2,
        score1: score,
        winner: winner
    });
}

function parsePhaseOtherThanFinal($, elem, currentMatches, index) {
    switch (index % 4) {
        case 0:
            currentMatches.push({
                date1: '',
                date2: '',
                time1: '',
                time2: '',
                team1: $(elem).find('td:nth-child(2) > a').text(),
                team2: $(elem).find('td:nth-child(4) > a').text(),
                score1: parseScore($(elem).find('td:nth-child(5) > a').text())
            });
            break;
        case 1:
            currentMatches[currentMatches.length - 1].score2 = parseScore($(elem).find('td:nth-child(5) > a').text(), true);
            break;
        case 2:
            const match = currentMatches[currentMatches.length - 1];
            match.date1 = $(elem).find('td:nth-child(2)').text().split(' ')[2];
            match.time1 = $(elem).find('td:nth-child(2)').text().split(' ')[3];
            match.date2 = $(elem).find('td:nth-child(4)').text().split(' ')[3];
            match.time2 = $(elem).find('td:nth-child(4)').text().split(' ')[4];
            match.winner = $(elem).find('td:nth-child(5) > b').text();
            break;
        default:
            break;
    }
}

// Clean score by removing useless parts
function parseScore(score, hasToReverseScore) {
    if (!score || score.indexOf('resch') !== -1) {
        return '-:-';
    }

    const scores = score
        .replace('pso', '')
        .replace('aet', '')
        .replace('(', '')
        .replace(')', '')
        .replace(new RegExp(',', 'g'), '')
        .trim()
        .split(' ');

    let newScorePart1 = scores[0];

    if (hasToReverseScore) {
        newScorePart1 = newScorePart1.split(':')[1] + ':' + newScorePart1.split(':')[0];
    }

    if (scores.length !== 4) {
        return newScorePart1;
    }

    let newScorePart2 = scores[3];

    if (hasToReverseScore) {
        newScorePart2 = newScorePart2.split(':')[1] + ':' + newScorePart2.split(':')[0];
    }

    return newScorePart2 + ' (' + newScorePart1 + ')';
}

module.exports = {
    update
};