'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for normal table
router.route('/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.tableData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('tables/table', { league: league, data: data });
        });
    });

// Route for mini table - Takes the first and last three teams
router.route('/mini/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.tableData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league);
            res.render('tables/tableMini', { league: league, data: [].concat(data.splice(0, 6), data.splice(-3, 3)) });
        });
    });

module.exports = router;