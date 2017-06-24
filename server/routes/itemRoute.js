'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var express = require('express');
var router = express.Router();

router.route('/:item/:year?/:roundOrGroup?')
    .get((req, res) => {
        var requestedItem = items.find(item => item.code === req.params.item) || items[0];
        var requestedYear = config.years.availables.find(year => req.params.year === year) || config.years.current;
        var requestedRoundOrGroup = req.params.roundOrGroup;

        var data = {
            title: 'Football Peek - ' + requestedItem.name + ' results - Season ' + requestedYear,
            description: 'Access ' + requestedItem.name + ' results, tables, top scorers and top assists for season ' + requestedYear,
            items: items,
            years: config.years.availables,
            requestedItem: requestedItem,
            requestedYear: requestedYear,
            scorersData: getData(config.paths.scorersData, requestedItem, requestedYear),
            assistsData: getData(config.paths.assistsData, requestedItem, requestedYear)
        };

        if (requestedItem.isCompetition) {
            renderCompetition(res, data, requestedItem, requestedYear, requestedRoundOrGroup);
        } else {
            renderLeague(res, data, requestedItem, requestedYear, requestedRoundOrGroup);
        }
    });

// Render a competition item
function renderCompetition(res, data, requestedItem, requestedYear, requestedRoundOrGroup) {
    var tournamentData = getData(config.paths.tournamentData, requestedItem, requestedYear);
    var groupsData = getData(config.paths.groupsData, requestedItem, requestedYear);
    var requestedGroup = requestedRoundOrGroup || 'a';

    res.render('competition', Object.assign(data, {
        tournamentData,
        groupsData,
        requestedYear: requestedYear,
        requestedGroup: requestedGroup,
        previousAndNextGroupUrls: getPreviousAndNextGroupUrls(requestedItem.code, requestedYear, requestedGroup, groupsData.length)
    }));
}

// Render a league item
function renderLeague(res, data, requestedItem, requestedYear, requestedRoundOrGroup) {
    var resultsData = getData(config.paths.resultsData, requestedItem, requestedYear);
    var tableData = getData(config.paths.tableData, requestedItem, requestedYear);
    var requestedRound = requestedRoundOrGroup || helper.getLeagueCurrentRound(resultsData);

    res.render('league', Object.assign(data, {
        resultsData,
        tableData,
        requestedYear: requestedYear,
        requestedRound: requestedRound,
        previousAndNextGroupUrls: getPreviousAndNextRoundUrls(requestedItem.code, requestedYear, requestedRound, resultsData.length)
    }));
}

function getData(dataPath, requestedItem, requestedYear) {
    return helper.readJsonFile(helper.stringFormat(dataPath, requestedItem.code, requestedYear));
}

function getPreviousAndNextGroupUrls(requestedItemCode, requestedYear, requestedGroup, numberOfGroups) {
    var requestedGroupCharCode = requestedGroup.charCodeAt(0);

    return {
        previous: requestedGroupCharCode > 96 + 1 ? getRoundOrGroupUrl(requestedItemCode, requestedYear, String.fromCharCode(requestedGroupCharCode - 1)) : null,
        next: requestedGroupCharCode < 96 + numberOfGroups ? getRoundOrGroupUrl(requestedItemCode, requestedYear, String.fromCharCode(requestedGroupCharCode + 1)) : null
    };
}

function getPreviousAndNextRoundUrls(requestedItemCode, requestedYear, requestedRound, numberOfRounds) {
    var requestedRoundNumber = parseInt(requestedRound, 10);

    return {
        previous: requestedRoundNumber > 1 ? getRoundOrGroupUrl(requestedItemCode, requestedYear, requestedRoundNumber - 1) : null,
        next: requestedRoundNumber < numberOfRounds ? getRoundOrGroupUrl(requestedItemCode, requestedYear, requestedRoundNumber + 1) : null
    };
}

function getRoundOrGroupUrl(requestedItemCode, requestedYear, roundOrGroup) {
    return '/' + requestedItemCode + '/' + requestedYear + '/' + roundOrGroup;
}

module.exports = router;