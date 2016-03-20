/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        paths: {
            tableData: './data/{0}/table.json',
            scorersData: './data/{0}/scorers.json',
            assistsData: './data/{0}/assists.json',
            imageData: './data/{0}/images/{1}.png'
        },
        leagues: {
            bundesliga: {
                code: 'bundesliga',
                name: 'Bundesliga'
            },
            liga: {
                code: 'liga',
                name: 'Liga'
            },
            ligue1: {
                code: 'ligue-1',
                name: 'Ligue 1'
            },
            premierLeague: {
                code: 'premier-league',
                name: 'Premier League'
            },
            serieA: {
                code: 'serie-a',
                name: 'Serie A'
            }
        }
    };
}

module.exports = config();