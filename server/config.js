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
            tableData: './data/{0}/tables/{1}.json',
            scorerData: './data/{0}/scorers/{1}.json'
        }
    };
}

module.exports = config();