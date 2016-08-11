'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var competitions = require('../data/competitions');
var express = require('express');
var router = express.Router();

// Route for item
router.route('/:item/:year?')
    .get((req, res) => {
        res.setHeader('Cache-Control', 'public, max-age=' + config.cachePeriods.oneHour);

        var requestedItem = items.find(item => item.code === req.params.item) || items[0];
        var requestedYear = config.years.availables.find(year => req.params.year === year) || config.years.current;

        var data = {
            title: 'Dashboard Football - ' + requestedItem.name + ' results - Season ' + requestedYear,
            description: 'Quick access to ' + requestedItem.name + ' results, tables, top scorers and top assists for season ' + requestedYear,
            items: items,
            years: config.years.availables,
            requestedItem: requestedItem,
            requestedYear: requestedYear,
            helpers: {
                isActive: function (code, options) {
                    return code === requestedItem.code ? options.fn(this) : options.inverse(this);
                },
                isWinner: function (team, winner, options) {
                    return team === winner ? options.fn(this) : options.inverse(this);
                }
            }
        };

        if (requestedItem === competitions.championsLeague || requestedItem === competitions.europaLeague) {
            renderCompetition(res, data, requestedItem, requestedYear);
        } else {
            renderLeague(res, data, requestedItem, requestedYear);
        }
    });

// Render a competition item
function renderCompetition(res, data, requestedItem, requestedYear) {
    res.render('competition', Object.assign(data, {
        tournamentData: helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, requestedItem.code, requestedYear)),
        groupsData: helper.readJsonFile(helper.stringFormat(config.paths.groupsData, requestedItem.code, requestedYear)),
        scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, requestedItem.code, requestedYear)),
        assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, requestedItem.code, requestedYear))
    }));
}

// Render a league item
function renderLeague(res, data, requestedItem, requestedYear) {
    res.render('league', Object.assign(data, {
        tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, requestedItem.code, requestedYear)),
        resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, requestedItem.code, requestedYear)),
        scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, requestedItem.code, requestedYear)),
        assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, requestedItem.code, requestedYear))
    }));
}

module.exports = router;