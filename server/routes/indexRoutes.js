'use strict';

var express = require('express');
var router = express.Router();

// Route for index
router.route('')
    .get((req, res) => {
        res.render('index');
    });

module.exports = router;