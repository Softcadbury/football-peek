'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var express = require('express');
var router = express.Router();

router.route('/chart/:item/:period?').get((req, res) => {
    var requestedItem = items.find(item => item.isCompetition && item.code === req.params.item) || items[0];
    var requestedPeriod = config.periods.availables.find(period => req.params.period === period) || config.periods.current;

    var data = {
        title: 'Football Peek - ' + requestedItem.name + ' results - Season ' + requestedPeriod,
        description: 'Access ' + requestedItem.name + ' results, tables, top scorers and top assists for season ' + requestedPeriod,
        items: items,
        datasets: [
            {
                label: 'Bayern München',
                showLine: true,
                data: [
                    {
                        x: 5,
                        y: 3
                    }
                ]
            }
        ]
    };

    var resultsData = getData(config.paths.resultsData, requestedItem, requestedPeriod);
    var datasetsDictionary = {};

    resultsData.forEach(result => {
        result.matches.forEach(matche => {
            setDatasetsDictionary(datasetsDictionary, matche.date, matche.homeTeam, matche.score);
            setDatasetsDictionary(datasetsDictionary, matche.date, matche.awayTeam, matche.score, true);
        });
    });

    console.log(datasetsDictionary);

    res.render('pages/chart', Object.assign(data));
});

function getData(dataPath, requestedItem, requestedPeriod) {
    return helper.readJsonFile(helper.stringFormat(dataPath, requestedItem.code, requestedPeriod));
}

function setDatasetsDictionary(datasetsDictionary, date, teamName, score, isAwayTeam) {
    if (!score.includes(':')) {
        return;
    }

    if (!datasetsDictionary[teamName]) {
        datasetsDictionary[teamName] = {
            label: teamName,
            showLine: true,
            data: []
        };
    }

    datasetsDictionary[teamName].data.push({ x: 1, y: 1 });
}

function getPoints(score, isAwayTeam) {
    var splittedScore = score.split(':');
    var score1 = isAwayTeam ? splittedScore[1] : splittedScore[0];
    var score2 = isAwayTeam ? splittedScore[0] : splittedScore[1];

    return score1 === score2 ? 1 : score1 > score2 ? 3 : 0;
}

module.exports = router;