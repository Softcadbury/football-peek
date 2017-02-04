'use strict';

var config = require('../config');
var items = require('../data/items');
var express = require('express');
var router = express.Router();

var data = {
    title: 'Dashboard Football - Quick access to football results',
    description: 'Quick access to football results, tables, top scorers and top assists from major leagues and competitions',
    items: items
};

router.route('/')
    .get((req, res) => {
        res.render('index', data);
    });

module.exports = router;