'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var express = require('express');
var router = express.Router();

router.route('/chart/:item/:period?').get((req, res) => {
    var requestedItem = items.find(item => item.code === req.params.item) || items[0];
    var requestedPeriod = config.periods.availables.find(period => req.params.period === period) || config.periods.current;

    var data = {
        title: 'Football Peek - ' + requestedItem.name + ' results - Season ' + requestedPeriod,
        description: 'Access ' + requestedItem.name + ' results, tables, top scorers and top assists for season ' + requestedPeriod,
        items: items
    };

    var resultsData = getData(config.paths.resultsData, requestedItem, requestedPeriod);
    var teams = {};

    resultsData.forEach(result => {
        result.matches.forEach(matche => {
            saveScore(teams, matche.date, matche.homeTeam, matche.awayTeam, matche.score);
        });
    });

    data.datasets = convertToDataset(teams);

    res.render('pages/chart', Object.assign(data));
});

function getData(dataPath, requestedItem, requestedPeriod) {
    return helper.readJsonFile(helper.stringFormat(dataPath, requestedItem.code, requestedPeriod));
}

function saveScore(datasetsDictionary, date, homeTeam, awayTeam, score) {
    if (!score.includes(':')) {
        return;
    }

    if (!datasetsDictionary[homeTeam]) {
        datasetsDictionary[homeTeam] = {
            name: homeTeam,
            matches: []
        };
    }
    if (!datasetsDictionary[awayTeam]) {
        datasetsDictionary[awayTeam] = {
            name: awayTeam,
            matches: []
        };
    }

    datasetsDictionary[homeTeam].matches.push({ date, points: getPoints(score, false) });
    datasetsDictionary[awayTeam].matches.push({ date, points: getPoints(score, true) });
}

function convertToDataset(teams) {
    return Object.values(teams).map((team) => {
        let currentPoints = 0;

        let points = team.matches.sort(sortDates).map(team => {
            currentPoints += team.points;
            return currentPoints;
        });

        return {
            name: team.name,
            data: points
        };
    });
}

function getPoints(score, isAwayTeam) {
    var splittedScore = score.split(':');
    var score1 = isAwayTeam ? splittedScore[1] : splittedScore[0];
    var score2 = isAwayTeam ? splittedScore[0] : splittedScore[1];

    return score1 === score2 ? 1 : score1 > score2 ? 3 : 0;
}

function sortDates(matche1, matche2) {
    var splittedDate1 = matche1.date.split('/').map(p => Number(p));
    var splittedDate2 = matche2.date.split('/').map(p => Number(p));

    var tick1 = splittedDate1[2] * 10000 + splittedDate1[1] * 100 + splittedDate1[0];
    var tick2 = splittedDate2[2] * 10000 + splittedDate2[1] * 100 + splittedDate2[0];

    return tick1 - tick2;
}

module.exports = router;