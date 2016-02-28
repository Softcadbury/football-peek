/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        currentYear: 2015,
        leagues: {
            bundesliga: 'bundesliga',
            liga: 'liga',
            ligue1: 'ligue-1',
            premierLeague: 'premier-league',
            serieA: 'serie-a'
        },
        paths: {
            resultsData: './data/{0}/results/{1}.json',
            tablesData: './data/{0}/tables/{1}.json',
            scorersData: './data/{0}/scorers/{1}.json',
            assistsData: './data/{0}/assists/{1}.json'
        }
    };
}

module.exports = config();