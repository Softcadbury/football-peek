'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for normal assists
router.route('/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.assistsData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            helper.AddLogos(league, data);
            res.render('components/assists/assists', { league: league, data: data });
        });
    });

// Route for mini assists - Takes the first nine players
router.route('/mini/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.assistsData, req.params.league), data => {
            var league = helper.getLeagueData(req.params.league);
            res.render('components/assists/assistsMini', { league: league, data: [].concat(data.splice(0, 9)) });
        });
    });

module.exports = router;