'use strict';

var config = require('../config');
var helper = require('../helper');
var request = require('request');
var fs = require('fs');

var tableDataUrl = 'http://www.lequipe.fr/Football/{0}-classement.html';
var leagues = [
    { name: config.leagues.bundesliga, code: 'championnat-d-allemagne' },
    { name: config.leagues.liga, code: 'championnat-d-espagne' },
    { name: config.leagues.ligue1, code: 'ligue-1' },
    { name: config.leagues.serieA, code: 'championnat-d-italie' },
    { name: config.leagues.premierLeague, code: 'championnat-d-angleterre' }
];

// Updates logos of current year
function update() {
    for (var i = 0; i < leagues.length; i++) {
        updateLogos(leagues[i]);
    }
}

// Updates logos of a league
function updateLogos(league) {
    helper.scrapeUrl(helper.stringFormat(tableDataUrl, league.code), function($) {
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
            var path = helper.stringFormat(config.paths.imageData, league.name, helper.stringSanitize(results[i].team));
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