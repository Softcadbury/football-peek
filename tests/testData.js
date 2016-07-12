/* global describe, it */
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
                    if (item.code !== competitions.championsLeague.code && item.code !== competitions.europaLeague.code) {
                        testTableData(item.code, year);
                        testResultData(item.code, year);
                    }

                    testScorersData(item.code, year);
                    testAssistsData(item.code, year);
                });
            });
        });
    });
});

function testTableData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.tableData, code, year));

    it('Table should have the right number of teams', () => {
        var expectedNumber = code === leagues.bundesliga.code ? 18 : 20;
        assert.lengthOf(data, expectedNumber);
    });

    testDataIsNotEmpty('Table', data);
    testDataIsNumber('Table', data);
}

function testScorersData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));

    it('Scorers should have the right number of players', () => {
        assert.lengthOf(data, 20);
    });

    testDataIsNotEmpty('Scorers', data);
    testDataIsNumber('Scorers', data);
}

function testAssistsData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.assistsData, code, year));

    it('Assists should have the right number of players', () => {
        assert.lengthOf(data, 20);
    });

    testDataIsNotEmpty('Assists', data);
    testDataIsNumber('Assists', data);
}

function testResultData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, year));

    testDataIsNotEmpty('Results', data);
}

function testDataIsNotEmpty(dataName, data) {
    it(dataName + ' should not have empty data', () => {
        data.forEach((item, index) => {
            for (var key in item) {
                if (item.hasOwnProperty(key) && key !== 'date') {
                    assert.notEqual('', item[key], 'Key "' + key + '" is empty for item ' + index);
                }
            }
        });
    });
}

function testDataIsNumber(dataName, data) {
    it(dataName + ' should have number data', () => {
        data.forEach((item, index) => {
            for (var key in item) {
                if (item.hasOwnProperty(key) && key !== 'rank' && key !== 'country' && key !== 'team' && key !== 'name' && key !== 'logo' && key !== 'flag' && key !== 'goalDifference') {
                    assert.isFalse(isNaN(item[key]), 'Key "' + key + '" is not a number for item ' + index + ', with the value "' + item[key] + '"');
                }
            }
        });
    });
}