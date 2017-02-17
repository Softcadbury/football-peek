'use strict';

var config = require('../config');
var helper = require('../helper');
var competitions = require('../data/competitions');

var tournamentDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-{2}';
var tournamentDataUrlExtensions = ['finale', 'halbfinale', 'viertelfinale', 'achtelfinale', 'sechzehntelfinale'];
var tournamentDataUrlExtensionsNames = ['Final', 'Semi-finals', 'Quarter-finals', 'Eighth-finals', 'Sixteenth-finals'];
var competitionsExtended = [
    { item: competitions.championsLeague, url: 'champions-league', roundNumber: 4 },
    { item: competitions.europaLeague, url: 'europa-league', roundNumber: 5 }
];

// Updates tournament of current year
function update(competitionArg) {
    helper.runUpdate(competitionsExtended, updateData, competitionArg);
}

// Updates the tournament of an itemExtended
function updateData(itemExtended) {
    var results = [];
    var promises = [];

    for (var i = 0; i < itemExtended.roundNumber; i++) {
        results.push({ name: tournamentDataUrlExtensionsNames[i], matches: [] });
        promises.push(parseRound(itemExtended, results, i));
    }

    Promise.all(promises).then(() => {
        if (itemExtended.roundNumber === 4 && (results[3].matches.length !== 8 || !results[3].matches[0].team1) ||
            itemExtended.roundNumber === 5 && (results[4].matches.length !== 16 || !results[4].matches[0].team1)) {
            helper.log('Error while updating tournament: ' + itemExtended.item.code);
            return;
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.tournamentData, itemExtended.item.code, config.years.current), results);
    });
}

// Parse a page of an itemExtended
function parseRound(itemExtended, results, roundIndex) {
    return new Promise((resolve) => {
        helper.scrapeUrl(helper.stringFormat(tournamentDataUrl, itemExtended.url, config.years.current, tournamentDataUrlExtensions[roundIndex]), ($) => {
            var currentMatches = results[roundIndex].matches;

            $('#site > div.white > div.content > div > div.box > div > table > tr').each((index, elem) => {
                if (itemExtended.roundNumber === 4 && index >= 32 || itemExtended.roundNumber === 5 && index >= 64) {
                    return;
                }

                if (roundIndex === 0) {
                    var team1 = $(elem).find('td:nth-child(3) > a').text();
                    var team2 = $(elem).find('td:nth-child(5) > a').text();

                    var score = parseScore($(elem).find('td:nth-child(6) > a').text());
                    var finalScore = score.split(' ').length === 1 ? score : score.split(' ')[1].replace('(', '').replace(')', '');

                    currentMatches.push({
                        team1: team1,
                        team2: team2,
                        score: score,
                        winner: finalScore.split(':')[0] > finalScore.split(':')[1] ? team1 : team2
                    });
                } else {
                    switch (index % 4) {
                        case 0:
                            currentMatches.push({
                                team1: $(elem).find('td:nth-child(2) > a').text(),
                                team2: $(elem).find('td:nth-child(4) > a').text(),
                                score1: parseScore($(elem).find('td:nth-child(5) > a').text())
                            });
                            break;
                        case 1:
                            currentMatches[currentMatches.length - 1].score2 = parseScore($(elem).find('td:nth-child(5) > a').text(), true);
                            break;
                        case 2:
                            currentMatches[currentMatches.length - 1].winner = $(elem).find('td:nth-child(5) > b').text();
                            break;
                        default:
                            break;
                    }
                }
            });

            for (var i = 0; i < currentMatches.length; i++) {
                currentMatches[i].team1Logo = helper.stringSanitize(currentMatches[i].team1);
                currentMatches[i].team2Logo = helper.stringSanitize(currentMatches[i].team2);
            }

            resolve();
        });
    });
}

// Clean score by removing useless parts
function parseScore(score, inverseScore) {
    if (!score) {
        return '-:-';
    }

    var scores = score
        .replace('pso', '')
        .replace('aet', '')
        .replace('(', '')
        .replace(')', '')
        .replace(new RegExp(',', 'g'), '')
        .trim()
        .split(' ');

    var newScorePart1 = scores[0];

    if (inverseScore) {
        newScorePart1 = newScorePart1.split(':')[1] + ':' + newScorePart1.split(':')[0];
    }

    if (scores.length !== 4) {
        return newScorePart1;
    }

    var newScorePart2 = scores[3];

    if (inverseScore) {
        newScorePart2 = newScorePart2.split(':')[1] + ':' + newScorePart2.split(':')[0];
    }

    return newScorePart2 + ' (' + newScorePart1 + ')';
}

module.exports = {
    update: update
};