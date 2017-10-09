'use strict';

var items = require('../data/items');
var config = require('../config');
var helper = require('../helper');
var express = require('express');
var router = express.Router();

var data = {
    title: 'Football Peek - The quickest access to football results',
    description: 'Access football results, tables, top scorers and top assists from the major leagues and competitions',
    items: items
};

router.route('/').get((req, res) => {
    getResults();

    res.render('pages/home', data);
});

function getResults() {
    var dates = getHandledDates();

    // items.forEach(item => {
    //     var resultsData = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, item.code, config.periods.current));
    //     console.log(resultsData);
    // });

    // var resultsData = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, items[0].code, config.periods.current));

    // resultsData.forEach(result => {
    //     result.matches.forEach((matche) => {
    //         console.log(matche.date);
    //     });
    // });
}

function getHandledDates() {
    var dates = [];
    var currentDate = new Date();
    var limitDate = 8;

    for (var i = limitDate; i >= 1; i--) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() - i))));
    }

    dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate()))));

    for (var i = 1; i <= limitDate; i++) {
        dates.push(getFormattedDate(new Date(new Date().setDate(currentDate.getDate() + i))));
    }

    return dates;
}

function getFormattedDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;

    return dd + '/' + mm + '/' + yyyy;
}

module.exports = router;
