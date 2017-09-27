'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var express = require('express');
var router = express.Router();

router.route('/:item/:period?/:roundOrGroup?')
    .get((req, res) => {
        var requestedItem = items.find(item => item.code === req.params.item) || items[0];
        var requestedPeriod = config.periods.availables.find(period => req.params.period === period) || config.periods.current;
        var requestedRoundOrGroup = req.params.roundOrGroup;

        var data = {
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
    var tournamentData = getData(config.paths.tournamentData, requestedItem, requestedPeriod);
    var groupsData = getData(config.paths.groupsData, requestedItem, requestedPeriod);
    var requestedGroup = requestedRoundOrGroup || 'a';

    res.render('pages/competition', Object.assign(data, {
        tournamentData,
        groupsData,
        requestedPeriod: requestedPeriod,
        requestedGroup: requestedGroup,
        previousAndNextGroupUrls: getPreviousAndNextGroupUrls(requestedItem.code, requestedPeriod, requestedGroup, groupsData.length)
    }));
}

// Render a league item
function renderLeague(res, data, requestedItem, requestedPeriod, requestedRoundOrGroup) {
    var resultsData = getData(config.paths.resultsData, requestedItem, requestedPeriod);
    var tableData = getData(config.paths.tableData, requestedItem, requestedPeriod);
    var requestedRound = requestedRoundOrGroup || helper.getLeagueCurrentRound(resultsData);

    res.render('pages/league', Object.assign(data, {
        resultsData,
        tableData,
        requestedPeriod: requestedPeriod,
        requestedRound: requestedRound,
        previousAndNextGroupUrls: getPreviousAndNextRoundUrls(requestedItem.code, requestedPeriod, requestedRound, resultsData.length)
    }));
}

function getData(dataPath, requestedItem, requestedPeriod) {
    return helper.readJsonFile(helper.stringFormat(dataPath, requestedItem.code, requestedPeriod));
}

function getPreviousAndNextGroupUrls(requestedItemCode, requestedPeriod, requestedGroup, numberOfGroups) {
    var requestedGroupCharCode = requestedGroup.charCodeAt(0);

    return {
        previous: requestedGroupCharCode > 96 + 1 ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, String.fromCharCode(requestedGroupCharCode - 1)) : null,
        next: requestedGroupCharCode < 96 + numberOfGroups ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, String.fromCharCode(requestedGroupCharCode + 1)) : null
    };
}

function getPreviousAndNextRoundUrls(requestedItemCode, requestedPeriod, requestedRound, numberOfRounds) {
    var requestedRoundNumber = parseInt(requestedRound, 10);

    return {
        previous: requestedRoundNumber > 1 ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, requestedRoundNumber - 1) : null,
        next: requestedRoundNumber < numberOfRounds ? getRoundOrGroupUrl(requestedItemCode, requestedPeriod, requestedRoundNumber + 1) : null
    };
}

function getRoundOrGroupUrl(requestedItemCode, requestedPeriod, roundOrGroup) {
    return '/' + requestedItemCode + '/' + requestedPeriod + '/' + roundOrGroup;
}

module.exports = router;