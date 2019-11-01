'use strict';

const config = require('../config');
const helper = require('../helper');
const items = require('../data/items');
const express = require('express');
const router = express.Router();

router.route('/:item/:period?/:roundOrGroup?').get((req, res) => {
    const requestedItem = items.find(item => item.code === req.params.item) || items[0];
    const requestedPeriod = config.periods.availables.find(period => req.params.period === period) || config.periods.current;
    const requestedRoundOrGroup = req.params.roundOrGroup;

    const data = {
        title: 'Football Peek - ' + requestedItem.name + ' results - Season ' + requestedPeriod,
        description: 'Access ' + requestedItem.name + ' results, tables, top scorers and top assists for season ' + requestedPeriod,
        items: items,
        periods: config.periods.availables,
        requestedItem: requestedItem,
        requestedPeriod: requestedPeriod,
        scorersData: getData(config.paths.scorersData, requestedItem, requestedPeriod),
        assistsData: getData(config.paths.assistsData, requestedItem, requestedPeriod)
    };

    if (requestedItem.isCompetition) {
        renderCompetition(res, data, requestedItem, requestedPeriod, requestedRoundOrGroup);
    } else {
        renderLeague(res, data, requestedItem, requestedPeriod, requestedRoundOrGroup);
    }
});

// Render a competition item
function renderCompetition(res, data, requestedItem, requestedPeriod, requestedRoundOrGroup) {
    const tournamentData = getData(config.paths.tournamentData, requestedItem, requestedPeriod);
    const groupsData = getData(config.paths.groupsData, requestedItem, requestedPeriod);
    const requestedGroup = requestedRoundOrGroup || 'a';

    res.render(
        'pages/competition',
        Object.assign(data, {
            tournamentData,
            groupsData,
            requestedPeriod: requestedPeriod,
            requestedGroup: requestedGroup,
            previousAndNextGroupUrls: getPreviousAndNextGroupUrls(requestedItem.code, requestedPeriod, requestedGroup, groupsData.length)
        })
    );
}

// Render a league item
function renderLeague(res, data, requestedItem, requestedPeriod, requestedRoundOrGroup) {
    const resultsData = getData(config.paths.resultsData, requestedItem, requestedPeriod);
    const tableData = getData(config.paths.tableData, requestedItem, requestedPeriod);
    const requestedRound = requestedRoundOrGroup || helper.getLeagueCurrentRound(resultsData);

    res.render(
        'pages/league',
        Object.assign(data, {
            resultsData,
            tableData,
            requestedPeriod: requestedPeriod,
            requestedRound: requestedRound,
            previousAndNextGroupUrls: getPreviousAndNextRoundUrls(requestedItem.code, requestedPeriod, requestedRound, resultsData.length),
            chartDatasets: getChartDatasets(resultsData)
        })
    );
}

function getData(dataPath, requestedItem, requestedPeriod) {
    return helper.readJsonFile(helper.stringFormat(dataPath, requestedItem.code, requestedPeriod));
}

function getPreviousAndNextGroupUrls(requestedItemCode, requestedPeriod, requestedGroup, numberOfGroups) {
    const requestedGroupCharCode = requestedGroup.charCodeAt(0);

    return {
        previous: requestedGroupCharCode > 96 + 1 ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, String.fromCharCode(requestedGroupCharCode - 1)) : null,
        next: requestedGroupCharCode < 96 + numberOfGroups ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, String.fromCharCode(requestedGroupCharCode + 1)) : null
    };
}

function getPreviousAndNextRoundUrls(requestedItemCode, requestedPeriod, requestedRound, numberOfRounds) {
    const requestedRoundNumber = parseInt(requestedRound, 10);

    return {
        previous: requestedRoundNumber > 1 ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, requestedRoundNumber - 1) : null,
        next: requestedRoundNumber < numberOfRounds ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, requestedRoundNumber + 1) : null
    };
}

function getRoundOrGroupUrl(requestedItemCode, requestedPeriod, roundOrGroup) {
    return '/' + requestedItemCode + '/' + requestedPeriod + '/' + roundOrGroup;
}

function getChartDatasets(resultsData) {
    const teams = {};

    resultsData.forEach(result => {
        result.matches.forEach(matche => {
            saveScore(teams, matche.date, matche.homeTeam, matche.awayTeam, matche.score);
        });
    });

    return convertToDataset(teams);
}

function saveScore(datasetsDictionary, date, homeTeam, awayTeam, score) {
    if (!score.includes(':') || score === '-:-') {
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

function getPoints(score, isAwayTeam) {
    const splittedScore = score.split(':');
    const score1 = isAwayTeam ? splittedScore[1] : splittedScore[0];
    const score2 = isAwayTeam ? splittedScore[0] : splittedScore[1];

    return score1 === score2 ? 1 : score1 > score2 ? 3 : 0;
}

function convertToDataset(teams) {
    return Object.values(teams).map(team => {
        let currentPoints = 0;

        const points = team.matches.map(matche => {
            currentPoints += matche.points;
            return currentPoints;
        });

        return {
            name: team.name,
            data: points
        };
    }).sort((team1, team2) => {
        const team1Points = team1.data[team1.data.length - 1];
        const team2Points = team2.data[team2.data.length - 1];

        return team1Points < team2Points ? 1 : team1Points > team2Points ? -1 : 0;
    });
}

module.exports = router;