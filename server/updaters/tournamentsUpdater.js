'use strict';

var config = require('../config');
var helper = require('../helper');
var competitions = require('../data/competitions');

var tournamentDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-{2}';
var tournamentDataUrlExtensions = ['finale', 'halbfinale', 'viertelfinale', 'achtelfinale', 'sechzehntelfinale'];
var competitionsExtended = [
    { code: competitions.championsLeague.code, url: 'champions-league', roundNumber: 4 },
    { code: competitions.europaLeague.code, url: 'europa-league', roundNumber: 5 }
];

// Updates tournament of current year
function update() {
    for (var i = 0; i < competitionsExtended.length; i++) {
        updateData(competitionsExtended[i]);
    }
}

// Updates the results of a competition
function updateData(competition) {
    var roundCounter = { count: 0 };
    var results = [
        { name: "Final", matches: [] },
        { name: "Semi-finals", matches: [] },
        { name: "Quarter-finals", matches: [] },
        { name: "Eighth-finals", matches: [] },
        { name: "Sixteenth-finals", matches: [] }
    ];

    parseRound(competition, results, roundCounter, 0);
    parseRound(competition, results, roundCounter, 1);
    parseRound(competition, results, roundCounter, 2);
    parseRound(competition, results, roundCounter, 3);
    parseRound(competition, results, roundCounter, 4);
}

// Parse a page of a competition
function parseRound(competition, results, roundCounter, round) {
    helper.scrapeUrl(helper.stringFormat(tournamentDataUrl, competition.url, config.years.current, tournamentDataUrlExtensions[round]), function ($) {
        $('#site > div.white > div.content > div > div.box > div > table > tr').each((index, elem) => {
            var currentMatches = results[round].matches;

            switch (index % 4) {
                case 0:
                    if (round == 0) {
                        var team1 = $(elem).find('td:nth-child(3) > a').text();
                        var team2 = $(elem).find('td:nth-child(5) > a').text();
                        var score = $(elem).find('td:nth-child(6) > a').text().split(' ')[0];

                        currentMatches.push({
                            team1: team1,
                            team2: team2,
                            score: score,
                            winner: score.split(':')[0] > score.split(':')[1] ? team1 : team2
                        });

                    } else {
                        currentMatches.push({
                            team1: $(elem).find('td:nth-child(2) > a').text(),
                            team2: $(elem).find('td:nth-child(4) > a').text(),
                            score1: $(elem).find('td:nth-child(5) > a').text().split(' ')[0]
                        });
                    }
                    break;
                case 1:
                    currentMatches[currentMatches.length - 1].score2 = $(elem).find('td:nth-child(5) > a').text().split(' ')[0];
                    break;
                case 2:
                    currentMatches[currentMatches.length - 1].winner = $(elem).find('td:nth-child(5) > b').text();
                    break;
            }
        });

        roundCounter.count++;
        if (roundCounter.count == competition.roundNumber) {
            helper.writeJsonFile(helper.stringFormat(config.paths.tournamentData, competition.code, config.years.current), results);
        }
    });
}

module.exports = {
    update: update
};