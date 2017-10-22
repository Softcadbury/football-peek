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
    res.render('pages/home', Object.assign(data, {
        itemsMatches: getItemsMatches()
    }));
});

function getItemsMatches() {
    var dates = getHandledDates();
    var itemsMatches = [];

    items.forEach(item => {
        var matches = [];

        if (item.isCompetition) {
            var tournamentData = helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, item.code, config.periods.current));

            tournamentData.forEach((round) => {
                round.matches.forEach((matche) => {
                    matches.push({
                        date: matche.date1,
                        score: matche.score1,
                        homeTeam: matche.team1,
                        awayTeam: matche.team2,
                        homeTeamLogo: matche.team1Logo,
                        awayTeamLogo: matche.team2Logo
                    });

                    if (dates.indexOf(matche.date2) !== -1) {
                        matches.push({
                            date: matche.date2,
                            score: matche.score2,
                            homeTeam: matche.team1,
                            awayTeam: matche.team2,
                            homeTeamLogo: matche.team1Logo,
                            awayTeamLogo: matche.team2Logo
                        });
                    }
                });
            });

            var groupsData = helper.readJsonFile(helper.stringFormat(config.paths.groupsData, item.code, config.periods.current));

            groupsData.forEach((group) => {
                group.matches.forEach((matche) => {
                    if (dates.indexOf(matche.date) !== -1) {
                        matches.push(matche);
                    }
                });
            });
        } else {
            var resultsData = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.periods.current));

            resultsData.forEach((result) => {
                result.matches.forEach((matche) => {
                    if (dates.indexOf(matche.date) !== -1) {
                        matches.push(matche);
                    }
                });
            });
        }

        itemsMatches.push({ item, matches });
    });

    return itemsMatches;
}

function getHandledDates() {
    var dates = [];
    var currentDate = new Date();
    var limitDate = 4;

    for (var i = limitDate; i >= 1; i--) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() - i))));
    }

    dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate()))));

    for (var i = 1; i <= limitDate; i++) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() + i))));
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

module.exports = router;
