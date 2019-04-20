'use strict';

var tablesUpdater = require('./tablesUpdater');
var resultsUpdater = require('./resultsUpdater');
var tournamentsUpdater = require('./tournamentsUpdater');
var groupsUpdater = require('./groupsUpdater');
var scorersUpdater = require('./scorersUpdater');
var assistsUpdater = require('./assistsUpdater');

// Updates league data
async function updateLeague(arg) {
    await tablesUpdater.update(arg);
    await resultsUpdater.update(arg);
    await scorersUpdater.updateLeagues(arg);
    await assistsUpdater.updateLeagues(arg);
}

// Updates competition data
async function updateCompetition(arg) {
    await tournamentsUpdater.update(arg);
    await groupsUpdater.update(arg);
    await scorersUpdater.updateCompetitions(arg);
    await assistsUpdater.updateCompetitions(arg);
}

module.exports = {
    updateLeague: updateLeague,
    updateCompetition: updateCompetition
};