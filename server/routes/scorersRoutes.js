'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for normal scorers
router.route('/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.scorersData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('scorers/scorers', { league: league, data: data });
        });
    });

// Route for mini scorers - Takes the first nine players
router.route('/mini/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.scorersData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league);
            res.render('scorers/scorersMini', { league: league, data: [].concat(data.splice(0, 9)) });
        });
    });

module.exports = router;