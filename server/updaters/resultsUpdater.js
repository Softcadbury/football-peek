'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../common/leagues');

var resultsDataUrl = 'http://www.flashscores.co.uk/football/{0}/';
var leaguesExtended = [
    { code: leagues.bundesliga.code, url: 'germany/bundesliga' },
    { code: leagues.liga.code, url: 'spain/primera-division' },
    { code: leagues.ligue1.code, url: 'france/ligue-1' },
    { code: leagues.serieA.code, url: 'italy/serie-a' },
    { code: leagues.premierLeague.code, url: 'england/premier-league' }
];

// Updates results of current year
function update() {
    for (var i = 0; i < leaguesExtended.length; i++) {
        updateData(leaguesExtended[i]);
    }
}

// Updates the results of a league
function updateData(league) {
    helper.scrapeUrl(helper.stringFormat(resultsDataUrl, league.url), function($) {
        var results = [];

        $('#fs-summary-results > table > tr.stage-finished').each((index, elem) => {
            console.log('------------------------------------------------');
            console.log('------------------------------------------------');
            console.log('------------------------------------------------');
            console.log($(elem).html());

            // results.push({
            //     rank: $(elem).find('td[headers=rank]').text() || '-',
            //     name: $(elem).find('td[headers=player]').text(),
            //     team: $(elem).find('td[headers=team]').text(),
            //     goals: $(elem).find('td[headers=goals]').text()
            // });
        });

        //helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, league.code), results);
    });
}

module.exports = {
    update: update
};