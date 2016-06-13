'use strict';

var items = require('../data/items');
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

module.exports = router;