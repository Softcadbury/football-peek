'use strict';

const tablesUpdater = require('./tablesUpdater');
const resultsUpdater = require('./resultsUpdater');
const tournamentsUpdater = require('./tournamentsUpdater');
const groupsUpdater = require('./groupsUpdater');
const scorersUpdater = require('./scorersUpdater');
const assistsUpdater = require('./assistsUpdater');
const config = require('../config');

// Updates league data
async function updateLeague(item) {
    await tablesUpdater.update(item);
    await resultsUpdater.update(item);
    await scorersUpdater.updateLeagues(item);
    await assistsUpdater.updateLeagues(item);
}

// Updates competition data
async function updateCompetition(item) {
    config.updateCompetitionTournaments && await tournamentsUpdater.update(item);
    config.updateCompetitionGroups && await groupsUpdater.update(item);
    await scorersUpdater.updateCompetitions(item);
    await assistsUpdater.updateCompetitions(item);
}

module.exports = {
    updateLeague,
    updateCompetition
};