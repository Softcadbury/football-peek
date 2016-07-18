'use strict';

var config = require('../config');
var helper = require('../helper');
var competitions = require('../data/competitions');

var tournamentDataUrl = 'http://www.worldfootball.net/schedule/{0}-{1}-{2}';
var tournamentDataUrlExtensions = ['finale', 'halbfinale', 'viertelfinale', 'achtelfinale'];
var competitionsExtended = [
    //{ code: competitions.championsLeague.code, url: 'champions-league' },
    { code: competitions.europaLeague.code, url: 'europa-league' }
];

// Updates tournament of current year
function update() {
    for (var i = 0; i < competitionsExtended.length; i++) {
        updateData(competitionsExtended[i]);
    }
}

// Updates the results of a competition
function updateData(competition) {
    helper.scrapeUrl(helper.stringFormat(tournamentDataUrl, competition.url, config.years.current), function ($) {
        var results = [
            { name: "Final", results: [] },
            { name: "Semi-finals", results: [] },
            { name: "Quarter-finals", results: [] },
            { name: "Eighth-finals", results: [] }
        ];

        //         {
        //             "date": "14/5/2016",
        //             "team1": "Leverkusen",
        //             "team2": "FC Ingolstadt",
        //             "score": "3-2",
        //             "winner": "1",
        //             "team1Logo": "1899_hoffenheim",
        //             "team2Logo": "1899_hoffenheim"
        //         }

        $('#site > div.white > div.content > div > div.box > div > table > tr').each((index, elem) => {
            results[0].results.push({
                "team1": $(elem).find('td:nth-child(2) > a').text(),
                "team2": $(elem).find('td:nth-child(4) > a').text(),
                "score": $(elem).find('td:nth-child(5) > a').text().split(' ')[0],
            });
        });

        // for (var i = 0; i < results.length; i++) {
        //     results[i].homeLogo = helper.stringSanitize(results[i].homeTeam);
        //     results[i].awayLogo = helper.stringSanitize(results[i].awayTeam);
        // }

        helper.writeJsonFile(helper.stringFormat(config.paths.tournamentData, competition.code, config.years.current), results);
    });
}

module.exports = {
    update: update
};