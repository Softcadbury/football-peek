'use strict';

var config = require('../config');
var express = require('express');
var router = express.Router();

router.route('/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.tableData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            res.render('tables/table', { data: obj });
        });
    });

router.route('/mini/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.tableData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            // Takes the first and last three
            var data = [].concat(obj.splice(0, 3), obj.splice(-3, 3));
            res.render('tables/tableMini', { data: data });
        });
    });

module.exports = router;