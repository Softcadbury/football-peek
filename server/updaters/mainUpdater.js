'use strict';

var tablesUpdater = require('./tablesUpdater');
var resultsUpdater = require('./resultsUpdater');
var tournamentsUpdater = require('./tournamentsUpdater');
var groupsUpdater = require('./groupsUpdater');
var scorersUpdater = require('./scorersUpdater');
var assistsUpdater = require('./assistsUpdater');

// Updates league data
function updateLeague(arg) {
    tablesUpdater.update(arg);
    resultsUpdater.update(arg);
    scorersUpdater.updateLeagues(arg);
    assistsUpdater.updateLeagues(arg);
}

// Updates competition data
function updateCompetition(arg) {
    tournamentsUpdater.update(arg);
    groupsUpdater.update(arg);
    scorersUpdater.updateCompetitions(arg);
    assistsUpdater.updateCompetitions(arg);
}

module.exports = {
    updateLeague: updateLeague,
    updateCompetition: updateCompetition
};