'use strict';

function leagues() {
    return {
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
    };
}

module.exports = leagues();