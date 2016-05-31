'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../data/leagues');
var express = require('express');
var router = express.Router();

// Route for index
router.route('/:league?')
    .get((req, res) => {
        var league = req.params.league || leagues.bundesliga.code;
        var data = {
            resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, league)),
            assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, league)),
            scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, league)),
            tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, league))
        };

        res.render('index', data);
    });

module.exports = router;