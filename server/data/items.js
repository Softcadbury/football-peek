'use strict';

var competitions = require('./competitions');
var leagues = require('./leagues');

function items() {
    return [
        leagues.premierLeague,
        leagues.liga,
        leagues.ligue1,
        leagues.serieA,
        leagues.bundesliga,
        competitions.championsLeague,
        competitions.europaLeague
    ];
}

module.exports = items();