'use strict';

var config = require('../config');
var helper = require('../helper');

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
        var result = [];

        $('#col-gauche > section > div.v6-page > table > tbody > tr').each((index, elem) => {
            if (index < 20) {
                result.push($(elem).find('td.team .team-label img').attr('src'));
                console.log($(elem).find('td.team .team-label img').attr('src'));
            }
        });
    });
}

module.exports = {
    update: update
};