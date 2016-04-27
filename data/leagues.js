'use strict';

function leagues() {
    return {
        bundesliga: {
            code: 'bundesliga',
            name: 'Bundesliga',
            logo: './bundesliga/images/logo.png'
        },
        liga: {
            code: 'liga',
            name: 'Liga',
            logo: './liga/images/logo.png'
        },
        ligue1: {
            code: 'ligue-1',
            name: 'Ligue 1',
            logo: './ligue-1/images/logo.png'
        },
        premierLeague: {
            code: 'premier-league',
            name: 'Premier League',
            logo: './premier-league/images/logo.png'
        },
        serieA: {
            code: 'serie-a',
            name: 'Serie A',
            logo: './serie-a/images/logo.png'
        }
    };
}

module.exports = leagues();