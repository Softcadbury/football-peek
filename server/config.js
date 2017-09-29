/* global process */
'use strict';

function config() {
    var periodFormat = '{0}-{1}';
    var firstHandledYear = 2001;
    var lastHandledPeriod = 2017;

    var currentPeriod = periodFormat.replace('{0}', lastHandledPeriod).replace('{1}', lastHandledPeriod + 1);
    var availablesPeriod = [];

    for (var i = lastHandledPeriod; i >= firstHandledYear; i--) {
        availablesPeriod.push(periodFormat.replace('{0}', i).replace('{1}', i + 1));
    }

    return {
        port: process.env.PORT || 5000,
        downloadImages: false,
        paths: {
            tableData: './data/{0}/{1}/table.json',
            scorersData: './data/{0}/{1}/scorers.json',
            assistsData: './data/{0}/{1}/assists.json',
            resultsData: './data/{0}/{1}/results.json',
            tournamentData: './data/{0}/{1}/tournament.json',
            groupsData: './data/{0}/{1}/groups.json',
            logosData: './data/images/logos/{0}.gif',
            flagsData: './data/images/flags/{0}.gif'
        },
        periods: {
            current: currentPeriod,
            availables: availablesPeriod
        }
    };
}

module.exports = config();
