'use strict';

var config = require('../config');
var items = require('../data/items');
var sm = require('sitemap');
var express = require('express');
var router = express.Router();

var sitemap = sm.createSitemap({ hostname: 'https://footballpeek.com/', cacheTime: 600000 });
sitemap.add({ url: '', changefreq: 'daily' });

items.forEach(item => {
    sitemap.add({ url: '/' + item.code + '/', changefreq: 'daily' });

    config.periods.availables.forEach(period => {
        var changefreq = period === config.periods.current ? 'daily' : 'weekly';
        sitemap.add({ url: '/' + item.code + '/' + period + '/', changefreq: changefreq });
    });
});

router.route('/sitemap.xml').get((req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(sitemap.toString());
});

module.exports = router;