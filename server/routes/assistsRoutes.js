'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for normal assists
router.route('/:league/:year')
    .get((req, res) => {
        helper.readJsonFile(config.paths.assistsData, [req.params.league, req.params.year], data => {
            res.render('assists/assists', { data: data });
        });
    });

// Route for mini assists - Takes the first nine players
router.route('/mini/:league/:year')
    .get((req, res) => {
        helper.readJsonFile(config.paths.assistsData, [req.params.league, req.params.year], data => {
            res.render('assists/assistsMini', { data: [].concat(data.splice(0, 9)) });
        });
    });

module.exports = router;