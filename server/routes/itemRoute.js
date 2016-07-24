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
        var requestedYear = null;
        var requestedItem = null;

        if (config.years.availables.some(year => req.params.year === year)) {
            requestedYear = req.params.year;
        } else {
            requestedYear = config.years.current;
        }

        items.forEach(item => {
            if (req.params.item === item.code) {
                requestedItem = item;
            }
        });

        requestedItem = requestedItem || items[0];
        requestedItem.isActive = true;

        var data = {
            title: 'Dashboard Football - Quick access to ' + requestedItem.name + ' results for season ' + requestedYear,
            description: 'Quick access to ' + requestedItem.name + ' results, tables, top scorers and top assists for season ' + requestedYear,
            items: items,
            years: config.years.availables,
            requestedItem: requestedItem,
            requestedYear: requestedYear,
            helpers: {
                isWinner: function (team, winner, options) {
                    return team === winner ? options.fn(this) : options.inverse(this);
                }
            }
        };

        if (requestedItem === competitions.championsLeague || requestedItem === competitions.europaLeague) {
            res.render('competition', Object.assign(data, {
                tournamentData: helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, requestedItem.code, requestedYear)),
                scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, requestedItem.code, requestedYear)),
                assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, requestedItem.code, requestedYear))
            }));
        } else {
            res.render('league', Object.assign(data, {
                resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, requestedItem.code, requestedYear)),
                tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, requestedItem.code, requestedYear)),
                scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, requestedItem.code, requestedYear)),
                assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, requestedItem.code, requestedYear))
            }));
        }
    });

module.exports = router;