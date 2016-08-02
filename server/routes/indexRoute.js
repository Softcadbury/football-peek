'use strict';

var items = require('../data/items');
var express = require('express');
var router = express.Router();

// Route for index
router.route('/')
    .get((req, res) => {
        var oneMonth = 2592000000;
        res.setHeader('Cache-Control', 'public, max-age=' + oneMonth);

        var data = {
            title: 'Dashboard Football - Quick access to football results',
            description: 'Quick access to football results, tables, top scorers and top assists from major leagues and competitions',
            items: items,
            helpers: {
                isActive: function (code, options) {
                    return options.inverse(this);
                }
            }
        };

        res.render('index', data);
    });

module.exports = router;