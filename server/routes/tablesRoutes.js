'use strict';

var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

// Route for normal table
router.route('/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.tableData, req.params.league), data => {
            res.render('tables/table', { data: data });
        });
    });

// Route for mini table - Takes the first and last three teams
router.route('/mini/:league')
    .get((req, res) => {
        helper.readJsonFile(helper.stringFormat(config.paths.tableData, req.params.league), data => {
            res.render('tables/tableMini', { data: [].concat(data.splice(0, 5), data.splice(-4, 4)) });
        });
    });

module.exports = router;