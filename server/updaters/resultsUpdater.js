'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../data/leagues');

var resultsDataUrl = 'http://www.football.fr/football/{0}/resultats.html';
var leaguesExtended = [
    { code: leagues.bundesliga.code, url: 'allemagne' },
    { code: leagues.liga.code, url: 'espagne' },
    { code: leagues.ligue1.code, url: 'ligue-1' },
    { code: leagues.serieA.code, url: 'italie' },
    { code: leagues.premierLeague.code, url: 'angleterre' }
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
        var currentDate;

        // Gets results
        $('.results tr').each((index, elem) => {
            if ($(elem).hasClass('white')) {
                currentDate = convertDate($(elem).find('td').text());
            } else if (!$(elem).hasClass('hidden')) {
                results.push({
                    date: currentDate,
                    homeTeam: $(elem).find('.team1 .name').text(),
                    awayTeam: $(elem).find('.team2 .name').text(),
                    score: $(elem).find('.score a').text().trim()
                });
            }
        });
        
        // Saves results
        helper.readJsonFile(helper.stringFormat(config.paths.teamsData, league.code), teams => {
            for (var i = 0; i < results.length; i++) {
                var closestHomeTeam = helper.getClosestTeam(teams, results[i].homeTeam);
                results[i].homeTeam = closestHomeTeam.team;
                results[i].logoHomeTeam = closestHomeTeam.logo;
                
                var closestAwayTeam = helper.getClosestTeam(teams, results[i].awayTeam);
                results[i].awayTeam = closestAwayTeam.team;
                results[i].logoAwayTeam = closestAwayTeam.logo;
            }
            
            helper.writeJsonFile(helper.stringFormat(config.paths.resultsData, league.code), results);
        });
    });
}

// Convert a french date to a nomalized date "samedi 02 avril 2016" => "02/04/2016"
function convertDate(date) {
    var parts = date.split(' ');
    var frenchMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                        'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    var indexOfMonth = frenchMonths.indexOf(parts[2]) + 1;

    return parts[1] + '/' + indexOfMonth + '/' + parts[3];
}

module.exports = {
    update: update
};