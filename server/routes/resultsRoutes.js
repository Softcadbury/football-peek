'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for normal results
router.route('/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.resultsData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league);
            res.render('components/results/results', { league: league, data: data });
        });
    });

module.exports = router;