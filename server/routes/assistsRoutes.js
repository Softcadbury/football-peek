'use strict';

var config = require('../config');
var express = require('express');
var router = express.Router();

router.route('/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.assistsData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            res.render('assists/assists', { data: obj });
        });
    });

router.route('/mini/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.assistsData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            // Takes the first and last three teams
            var data = [].concat(obj.splice(0, 9));
            res.render('assists/assistsMini', { data: data });
        });
    });

module.exports = router;