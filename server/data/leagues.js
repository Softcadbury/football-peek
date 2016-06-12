'use strict';

function leagues() {
    return {
        bundesliga: {
            code: 'bundesliga',
            name: 'Bundesliga',
            smallName: 'Bundesliga'
        },
        liga: {
            code: 'liga',
            name: 'Liga',
            smallName: 'Liga'
        },
        ligue1: {
            code: 'ligue-1',
            name: 'Ligue 1',
            smallName: 'L1'
        },
        premierLeague: {
            code: 'premier-league',
            name: 'Premier League',
            smallName: 'PL'
        },
        serieA: {
            code: 'serie-a',
            name: 'Serie A',
            smallName: 'Serie A'
        }
    };
}

module.exports = leagues();