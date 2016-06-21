'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var competitions = require('../data/competitions');
var express = require('express');
var router = express.Router();

// Route for item
router.route('/:item')
    .get((req, res) => {
        var requestedItem = null;
        var requestedYear = config.requestedYear;

        items.forEach(function (item) {
            if (req.params.item === item.code) {
                requestedItem = item;
            }
        });

        requestedItem = requestedItem || items[0];
        requestedItem.isActive = true;

        var data = {
            title: 'Dashboard Football - Quick access to ' + requestedItem.name + ' results',
            items: items,
            requestedItem: requestedItem,
        };

        if (requestedItem == competitions.championsLeague || requestedItem == competitions.europaLeague) {
            res.render('competition', Object.assign(data, {
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