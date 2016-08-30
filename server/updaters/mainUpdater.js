'use strict';

var tablesUpdater = require('./tablesUpdater');
var resultsUpdater = require('./resultsUpdater');
var tournamentsUpdater = require('./tournamentsUpdater');
var groupsUpdater = require('./groupsUpdater');
var scorersUpdater = require('./scorersUpdater');
var assistsUpdater = require('./assistsUpdater');

// Update league data
function updateLeague(leagueArg) {
    leagueArg = leagueArg || true;

    tablesUpdater.update(leagueArg);
    resultsUpdater.update(leagueArg);
    scorersUpdater.update(leagueArg, null);
    assistsUpdater.update(leagueArg, null);
}

// Update competition data
function updateCompetition(competitionArg) {
    competitionArg = competitionArg || true;

    tournamentsUpdater.update(competitionArg);
    groupsUpdater.update(competitionArg);
    scorersUpdater.update(null, competitionArg);
    assistsUpdater.update(null, competitionArg);
}

module.exports = {
    updateLeague: updateLeague,
    updateCompetition: updateCompetition
};