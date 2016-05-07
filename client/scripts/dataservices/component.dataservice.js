'use strict';

var dataServiceHelper = require('../helpers/dataservice.helper');

// Gets league results
function getLeagueResults(league) {
    return dataServiceHelper.get('/components/results/' + league);
}

// Gets league assists
function getLeagueAssists(league) {
    return dataServiceHelper.get('/components/assists/' + league);
}

// Gets league scorers
function getLeagueScorers(league) {
    return dataServiceHelper.get('/components/scorers/' + league);
}

// Gets league table
function getLeagueTable(league) {
    return dataServiceHelper.get('/components/table/' + league);
}

module.exports = {
    getLeagueResults: getLeagueResults,
    getLeagueAssists: getLeagueAssists,
    getLeagueScorers: getLeagueScorers,
    getLeagueTable: getLeagueTable
};