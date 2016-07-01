'use strict';

var assert = require('chai').assert;
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');
var leagues = require('../server/data/leagues');
var competitions = require('../server/data/competitions');

describe('Data intergrity', () => {
    items.forEach(item => {
        describe(item.name, () => {
            config.years.availables.forEach(year => {
                describe(year, () => {
                    if (item.code != competitions.championsLeague.code && item.code != competitions.europaLeague.code) {
                        testTableData(item.code, year);
                    }

                    if (year == config.years.current) {
                        testScorersData(item.code, year);
                        testAssistsData(item.code, year);
                    }
                });
            });
        });
    });
});

function testTableData(code, year) {
    var tableData = helper.readJsonFile(helper.stringFormat(config.paths.tableData, code, year));

    it('Table should have the right number of teams', () => {
        var expectedNumber = code == leagues.bundesliga.code ? 18 : 20;
        assert.equal(expectedNumber, tableData.length);
    });
}

function testScorersData(code, year) {
    var scorersData = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));

    it('Scorers should have the right number of players', () => {
        assert.equal(20, scorersData.length);
    });
}

function testAssistsData(code, year) {
    var assistsData = helper.readJsonFile(helper.stringFormat(config.paths.assistsData, code, year));

    it('Assists should have the right number of players', () => {
        assert.equal(20, assistsData.length);
    });
}