'use strict';

function config() {
    const periodFormat = '{0}-{1}';
    const firstHandledYear = 2000;
    const lastHandledPeriod = 2020;

    const currentPeriod = periodFormat.replace('{0}', lastHandledPeriod).replace('{1}', lastHandledPeriod + 1);
    const availablesPeriod = [];

    for (let i = lastHandledPeriod; i >= firstHandledYear; i--) {
        availablesPeriod.push(periodFormat.replace('{0}', i).replace('{1}', i + 1));
    }

    return {
        port: process.env.PORT || 5000,
        downloadImages: false,
        fullResultUpdate: false,
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