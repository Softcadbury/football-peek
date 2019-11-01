'use strict';

const items = require('../data/items');
const config = require('../config');
const helper = require('../helper');
const express = require('express');
const router = express.Router();

const data = {
    title: 'Football Peek - The quickest access to football results',
    description: 'Access football results, tables, top scorers and top assists from the major leagues and competitions',
    items: items
};

router.route('/').get((req, res) => {
    res.render(
        'pages/home',
        Object.assign(data, {
            competitionsMatches: getItemsMatches(items.filter(p => p.isCompetition), 14),
            leaguesMatches: getItemsMatches(items.filter(p => !p.isCompetition), 4)
        })
    );
});

function getItemsMatches(filteredItems, limitDate) {
    const dates = getHandledDates(limitDate);
    const itemsMatches = [];

    filteredItems.forEach(item => {
        const matches = item.isCompetition ? getCompetitionMatches(item, dates) : getLeagueMatches(item, dates);

        if (matches.length) {
            itemsMatches.push({ item, matches });
        }
    });

    return itemsMatches;
}

function getLeagueMatches(item, handledDates) {
    const resultsData = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.periods.current));
    const matches = [];

    resultsData.forEach(result => {
        result.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date) !== -1) {
                matches.push(matche);
            }
        });
    });

    return matches.sort(sortMatchesByDate);
}

function getCompetitionMatches(item, handledDates) {
    const tournamentData = helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, item.code, config.periods.current));
    const tournamentMatches = [];

    for (let i = tournamentData.length - 1; i >= 0; i--) {
        const round = tournamentData[i];

        round.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date1) !== -1) {
                tournamentMatches.push({
                    date: matche.date1,
                    time: matche.time1,
                    score: matche.score1,
                    homeTeam: matche.team1,
                    awayTeam: matche.team2,
                    homeTeamLogo: matche.team1Logo,
                    awayTeamLogo: matche.team2Logo
                });
            }

            if (handledDates.indexOf(matche.date2) !== -1 && matche.score2.indexOf(':') != -1) {
                const reversedScore = matche.score2.split(':')[1] + ':' + matche.score2.split(':')[0];
                tournamentMatches.push({
                    date: matche.date2,
                    time: matche.time2,
                    score: reversedScore,
                    homeTeam: matche.team2,
                    awayTeam: matche.team1,
                    homeTeamLogo: matche.team2Logo,
                    awayTeamLogo: matche.team1Logo
                });
            }
        });
    }

    if (tournamentMatches.length) {
        return tournamentMatches.sort(sortMatchesByDate);
    }

    const groupsData = helper.readJsonFile(helper.stringFormat(config.paths.groupsData, item.code, config.periods.current));
    const groupMatches = [];

    groupsData.forEach(group => {
        group.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date) !== -1) {
                groupMatches.push(matche);
            }
        });
    });

    return groupMatches.sort(sortMatchesByDate);
}

function getHandledDates(limitDate) {
    const currentDate = new Date();
    const dates = [];

    for (let i = limitDate; i >= 1; i--) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() - i))));
    }

    dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate()))));

    for (let j = 1; j <= limitDate; j++) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() + j))));
    }

    return dates;
}

function getFormattedDate(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return dd + '/' + mm + '/' + yyyy;
}

function sortMatchesByDate(matche1, matche2) {
    const splittedDate1 = matche1.date.split('/').map(p => Number(p));
    const splittedDate2 = matche2.date.split('/').map(p => Number(p));

    const tick1 = splittedDate1[2] * 10000 + splittedDate1[1] * 100 + splittedDate1[0];
    const tick2 = splittedDate2[2] * 10000 + splittedDate2[1] * 100 + splittedDate2[0];

    return tick1 < tick2 ? -1 : tick1 > tick2 ? 1 : 0;
}

module.exports = router;