'use strict';

var config = require('../config');
var helper = require('../helper');
var leagues = require('../leagues');
var sm = require('sitemap');
var express = require('express');
var router = express.Router();

// Route for sitemap
var sitemap = sm.createSitemap({ hostname: 'http://dashboardfootball.com', cacheTime: 600000 });
sitemap.add({ url: '', changefreq: 'daily' });

for (var item in leagues) {
    if (leagues.hasOwnProperty(item)) {
        sitemap.add({ url: '/' + leagues[item].code + '/', changefreq: 'daily' });
    }
}

router.route('/sitemap.xml')
    .get((req, res) => {
        res.header('Content-Type', 'application/xml');
        res.send(sitemap.toString());
    });

// Route for index
router.route('/:league?')
    .get((req, res) => {
        var currentLeague = null;

        for (var item in leagues) {
            if (leagues.hasOwnProperty(item)) {
                leagues[item].isActive = false;
                if (req.params.league === leagues[item].code) {
                    currentLeague = leagues[item];
                }
            }
        }

        currentLeague = currentLeague || leagues.bundesliga;
        currentLeague.isActive = true;

        var data = {
            leagues: leagues,
            resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, currentLeague.code)),
            assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, currentLeague.code)),
            scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, currentLeague.code)),
            tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, currentLeague.code))
        };

        res.render('index', data);
    });

module.exports = router;