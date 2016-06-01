'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../../data/leagues');
var express = require('express');
var router = express.Router();

// Route for index
router.route('/:league?')
    .get((req, res) => {
        var currentLeague = null;
        
        for (var item in leagues) {
            leagues[item].isActive = false;
            if (req.params.league == leagues[item].code) {
                currentLeague = leagues[item];
            }
        }
        
        currentLeague = currentLeague || leagues.bundesliga;
        currentLeague.isActive = true;
        
        var data = {
            leagues: leagues,
            resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, currentLeague.code)),
            assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, currentLeague.code)),
            scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, currentLeague.code)),
            tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, currentLeague.code))
        };

        res.render('index', data);
    });

module.exports = router;