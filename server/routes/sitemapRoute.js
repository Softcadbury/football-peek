'use strict';

const config = require('../config');
const items = require('../data/items');
const sm = require('sitemap');
const express = require('express');
const router = express.Router();

const sitemap = sm.createSitemap({ hostname: 'https://footballpeek.com/', cacheTime: 600000 });
sitemap.add({ url: '', changefreq: 'daily' });

items.forEach(item => {
    sitemap.add({ url: '/' + item.code + '/', changefreq: 'daily' });

    config.periods.availables.forEach(period => {
        const changefreq = period === config.periods.current ? 'daily' : 'weekly';
        sitemap.add({ url: '/' + item.code + '/' + period + '/', changefreq: changefreq });
    });
});

router.route('/sitemap.xml').get((req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(sitemap.toString());
});

module.exports = router;