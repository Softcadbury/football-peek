'use strict';

const competitions = require('./competitions');
const leagues = require('./leagues');

const items = [
    leagues.premierLeague,
    leagues.liga,
    leagues.ligue1,
    leagues.serieA,
    leagues.bundesliga,
    competitions.championsLeague,
    competitions.europaLeague
];

module.exports = items;