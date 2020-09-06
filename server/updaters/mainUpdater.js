'use strict';

const tablesUpdater = require('./tablesUpdater');
const resultsUpdater = require('./resultsUpdater');
// const tournamentsUpdater = require('./tournamentsUpdater');
const groupsUpdater = require('./groupsUpdater');
const scorersUpdater = require('./scorersUpdater');
const assistsUpdater = require('./assistsUpdater');

// Updates league data
async function updateLeague(item) {
    await tablesUpdater.update(item);
    await resultsUpdater.update(item);
    await scorersUpdater.updateLeagues(item);
    await assistsUpdater.updateLeagues(item);
}

// Updates competition data
async function updateCompetition(item) {
    // await tournamentsUpdater.update(item); phase not started yet
    await groupsUpdater.update(item);
    await scorersUpdater.updateCompetitions(item);
    await assistsUpdater.updateCompetitions(item);
}

module.exports = {
    updateLeague,
    updateCompetition
};