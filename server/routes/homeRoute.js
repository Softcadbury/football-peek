'use strict';

var items = require('../data/items');
var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

var data = {
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
    var dates = getHandledDates(limitDate);
    var itemsMatches = [];

    filteredItems.forEach(item => {
        var matches = item.isCompetition ? getCompetitionMatches(item, dates) : getLeagueMatches(item, dates);

        if (matches.length) {
            itemsMatches.push({ item, matches });
        }
    });

    return itemsMatches;
}

function getLeagueMatches(item, handledDates) {
    var resultsData = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.periods.current));
    var matches = [];

    resultsData.forEach(result => {
        result.matches.forEach(matche => {
            if (handledDates.indexOf(matche.date) !== -1) {
                matches.push(matche);
            }
        });
    });

    return matches;
}

function getCompetitionMatches(item, handledDates) {
    var tournamentData = helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, item.code, config.periods.current));
    var tournamentMatches = [];

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
                var reversedScore = matche.score2.split(':')[1] + ':' + matche.score2.split(':')[0];
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

    var groupsData = helper.readJsonFile(helper.stringFormat(config.paths.groupsData, item.code, config.periods.current));
    var groupMatches = [];

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
    var currentDate = new Date();
    var dates = [];

    for (var i = limitDate; i >= 1; i--) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() - i))));
    }

    dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate()))));

    for (var j = 1; j <= limitDate; j++) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() + j))));
    }

    return dates;
}

function getFormattedDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return dd + '/' + mm + '/' + yyyy;
}

function sortMatchesByDate(matche1, matche2) {
    var splittedDate1 = matche1.date.split('/').map(p => Number(p));
    var splittedDate2 = matche2.date.split('/').map(p => Number(p));

    var tick1 = splittedDate1[2] * 10000 + splittedDate1[1] * 100 + splittedDate1[0];
    var tick2 = splittedDate2[2] * 10000 + splittedDate2[1] * 100 + splittedDate2[0];

    return tick1 - tick2;
}

module.exports = router;