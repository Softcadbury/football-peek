'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../data/leagues');
var request = require('request');
var fs = require('fs');

var tableDataUrl = 'http://www.lequipe.fr/Football/{0}-classement.html';
var leaguesExtended = [
    { code: leagues.bundesliga.code, url: 'championnat-d-allemagne' },
    { code: leagues.liga.code, url: 'championnat-d-espagne' },
    { code: leagues.ligue1.code, url: 'ligue-1' },
    { code: leagues.serieA.code, url: 'championnat-d-italie' },
    { code: leagues.premierLeague.code, url: 'championnat-d-angleterre' }
];

// Updates teams of current year
function update() {
    for (var i = 0; i < leaguesExtended.length; i++) {
        updateTeams(leaguesExtended[i]);
    }
}

// Updates teams of a league
function updateTeams(league) {
    helper.scrapeUrl(helper.stringFormat(tableDataUrl, league.url), function($) {
        var results = [];

        $('#col-gauche > section > div.v6-page > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                results.push({
                    team: $(elem).find('td.team .team-label').text(),
                    logo: $(elem).find('td.team .team-label img').attr('src')
                });
            }
        });

        for (var i = 0; i < results.length; i++) {
            var sanitizedTeamName = helper.stringSanitize(results[i].team);
            var path = helper.stringFormat(config.paths.imageData, league.code, sanitizedTeamName);
            var publicPath = helper.stringFormat(config.paths.publicImageData, league.code, sanitizedTeamName);
            
            downloadImage(results[i].logo, path);
            results[i].logo = publicPath;
        }

        helper.writeJsonFile(helper.stringFormat(config.paths.teamsData, league.code), results);
    });
}

// Download an image in a path
function downloadImage(src, path) {
    request.head(src, function(err, res, body) {
        request(src).pipe(fs.createWriteStream(path)).on('close', function() {
            console.log('Image updated: ' + path);
        });
    });
}

module.exports = {
    update: update
};