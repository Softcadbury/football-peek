'use strict';

var competitions = require('./competitions');
var leagues = require('./leagues');

function items() {
    return [
        competitions.championsLeague,
        competitions.europaLeague,
        leagues.bundesliga,
        leagues.liga,
        leagues.ligue1,
        leagues.premierLeague,
        leagues.serieA
    ];
}

module.exports = items();