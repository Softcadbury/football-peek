'use strict';

var items = require('../data/items');
var express = require('express');
var router = express.Router();

// Route for index
router.route('/')
    .get((req, res) => {
        var data = {
            title: 'Dashboard Football - Quick access to football results',
            items: items,
            isIndex: true
        };

        res.render('index', data);
    });

module.exports = router;