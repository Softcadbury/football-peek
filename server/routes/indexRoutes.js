'use strict';

var config = require('../config');
var helper = require('../helper');
var items = require('../data/items');
var competitions = require('../data/competitions');
var sm = require('sitemap');
var express = require('express');
var router = express.Router();

// Route for sitemap
var sitemap = sm.createSitemap({ hostname: 'http://dashboardfootball.com', cacheTime: 600000 });
sitemap.add({ url: '', changefreq: 'daily' });

items.forEach(function (item) {
    sitemap.add({ url: '/' + item.code + '/', changefreq: 'daily' });
});

router.route('/sitemap.xml')
    .get((req, res) => {
        res.header('Content-Type', 'application/xml');
        res.send(sitemap.toString());
    });

// Route for index
router.route('/')
    .get((req, res) => {
        items.forEach(function (item) {
            item.isActive = false;
        });

        var data = {
            items: items,
            isIndex: true
        };

        res.render('index', data);
    });

// Route for league
router.route('/:league')
    .get((req, res) => {
        var currentLeague = null;

        items.forEach(function (item) {
            item.isActive = false;

            if (req.params.league === item.code) {
                currentLeague = item;
            }
        });

        currentLeague = currentLeague || items[0];
        currentLeague.isActive = true;

        var data = {
            items: items,
            currentLeague: currentLeague,
        };

        if (currentLeague == competitions.championsLeague || currentLeague == competitions.europaLeague) {
            res.render('league', Object.assign({}, data));
        } else {
            res.render('league', Object.assign({}, data, {
                resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, currentLeague.code)),
                assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, currentLeague.code)),
                scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, currentLeague.code)),
                tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, currentLeague.code))
            }));
        }
    });

module.exports = router;