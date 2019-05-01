'use strict';

var tablesUpdater = require('./tablesUpdater');
var resultsUpdater = require('./resultsUpdater');
var tournamentsUpdater = require('./tournamentsUpdater');
var groupsUpdater = require('./groupsUpdater');
var scorersUpdater = require('./scorersUpdater');
var assistsUpdater = require('./assistsUpdater');

// Updates league data
async function updateLeague(item) {
    await tablesUpdater.update(item);
    await resultsUpdater.update(item);
    await scorersUpdater.updateLeagues(item);
    await assistsUpdater.updateLeagues(item);
}

// Updates competition data
async function updateCompetition(item) {
    await tournamentsUpdater.update(item);
    await groupsUpdater.update(item);
    await scorersUpdater.updateCompetitions(item);
    await assistsUpdater.updateCompetitions(item);
}

module.exports = {
    updateLeague: updateLeague,
    updateCompetition: updateCompetition
};