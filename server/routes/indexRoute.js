'use strict';

var items = require('../data/items');
var express = require('express');
var router = express.Router();

var data = {
    title: 'Football Peek - The quickest access to football results',
    description: 'Access football results, tables, top scorers and top assists from the major leagues and competitions',
    items: items
};

router.route('/')
    .get((req, res) => {
        res.render('index', data);
    });

module.exports = router;