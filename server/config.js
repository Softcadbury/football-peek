/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        leagues: {
            bundesliga: 'bundesliga',
            liga: 'liga',
            ligue1: 'ligue-1',
            premierLeague: 'premier-league',
            serieA: 'serie-a'
        },
        paths: {
            resultsData: './data/{0}/results.json',
            tableData: './data/{0}/table.json',
            scorersData: './data/{0}/scorers.json',
            assistsData: './data/{0}/assists.json',
            image: './images/{0}/{1}.png'
        }
    };
}

module.exports = config();