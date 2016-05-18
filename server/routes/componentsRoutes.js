'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for results
router.route('/results/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.resultsData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('components/results', { league: league, data: data });
        });
    });

// Route for assists
router.route('/assists/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.assistsData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('components/assists', { league: league, data: data });
        });
    });

// Route for scorers
router.route('/scorers/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.scorersData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('components/scorers', { league: league, data: data });
        });
    });

// Route for table
router.route('/table/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.tableData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('components/table', { league: league, data: data });
        });
    });

module.exports = router;