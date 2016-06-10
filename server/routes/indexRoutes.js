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
            title: 'Dashboard Football - Quick access to football results',
            items: items,
            isIndex: true
        };

        res.render('index', data);
    });

// Route for item
router.route('/:item')
    .get((req, res) => {
        var currentItem = null;

        items.forEach(function (item) {
            item.isActive = false;

            if (req.params.item === item.code) {
                currentItem = item;
            }
        });

        currentItem = currentItem || items[0];
        currentItem.isActive = true;

        var data = {
            title: 'Dashboard Football - Quick access to ' + currentItem.name + ' results',
            items: items,
            currentItem: currentItem,
        };

        if (currentItem == competitions.championsLeague || currentItem == competitions.europaLeague) {
            res.render('competition', Object.assign(data, {
                scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, currentItem.code))
            }));
        } else {
            res.render('league', Object.assign(data, {
                resultsData: helper.readJsonFile(helper.stringFormat(config.paths.resultsData, currentItem.code)),
                assistsData: helper.readJsonFile(helper.stringFormat(config.paths.assistsData, currentItem.code)),
                scorersData: helper.readJsonFile(helper.stringFormat(config.paths.scorersData, currentItem.code)),
                tableData: helper.readJsonFile(helper.stringFormat(config.paths.tableData, currentItem.code))
            }));
        }
    });

module.exports = router;