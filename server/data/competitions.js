'use strict';

const competitions = {
    championsLeague: {
        code: 'champions-league',
        name: 'Champions League',
        smallName: 'C1'
    },
    europaLeague: {
        code: 'europa-league',
        name: 'Europa League',
        smallName: 'C3'
    }
};

// Add property isCompetition to every competition
for (let competition in competitions) {
    if (competitions.hasOwnProperty(competition)) {
        competitions[competition].isCompetition = true;
    }
}

module.exports = competitions;