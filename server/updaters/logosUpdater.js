'use strict';

var config = require('../config');
var helper = require('../helper');
var request = require('request');
var fs = require('fs');

var tableDataUrl = 'http://www.lequipe.fr/Football/{0}-classement.html';
var leagues = [
    { code: config.leagues.bundesliga.code, url: 'championnat-d-allemagne' },
    { code: config.leagues.liga.code, url: 'championnat-d-espagne' },
    { code: config.leagues.ligue1.code, url: 'ligue-1' },
    { code: config.leagues.serieA.code, url: 'championnat-d-italie' },
    { code: config.leagues.premierLeague.code, url: 'championnat-d-angleterre' }
];

// Updates logos of current year
function update() {
    for (var i = 0; i < leagues.length; i++) {
        updateLogos(leagues[i]);
    }
}

// Updates logos of a league
function updateLogos(league) {
    helper.scrapeUrl(helper.stringFormat(tableDataUrl, league.url), function($) {
        var results = [];

        $('#col-gauche > section > div.v6-page > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                results.push({
                    team: $(elem).find('td.team .team-label').text(),
                    src: $(elem).find('td.team .team-label img').attr('src')
                });
            }
        });

        for (var i = 0; i < results.length; i++) {
            var path = helper.stringFormat(config.paths.imageData, league.code, helper.stringSanitize(results[i].team));
            downloadImage(results[i].src, path);
        }
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