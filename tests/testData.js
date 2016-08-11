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
                    if (item.code === competitions.championsLeague.code || item.code === competitions.europaLeague.code) {
                        testTournamentData(item.code, year);
                    } else {
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
    testDataIsNotEmpty('Table', data);
    testDataIsNumber('Table', data);

    it('Table should have the right number of teams', () => {
        var expectedNumber = code === leagues.bundesliga.code ? 18 : 20;
        assert.lengthOf(data, expectedNumber);
    });
}

function testScorersData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));
    testDataIsNotEmpty('Scorers', data);
    testDataIsNumber('Scorers', data);

    it('Scorers should have the right number of players', () => {
        assert.lengthOf(data, 20);
    });
}

function testAssistsData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.assistsData, code, year));
    testDataIsNotEmpty('Assists', data);
    testDataIsNumber('Assists', data);

    it('Assists should have the right number of players', () => {
        assert.lengthOf(data, 20);
    });
}

function testResultData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, year));
    testDataIsNotEmpty('Results', data[0].matches);
}

function testTournamentData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, code, year));
    testDataIsNotEmpty('Tournament Final', data[0].matches);
    testDataIsNotEmpty('Tournament Semi-finals', data[1].matches);
    testDataIsNotEmpty('Tournament Quarter-finals', data[2].matches);
    testDataIsNotEmpty('Tournament Eighth-finals', data[3].matches);
    testDataIsNotEmpty('Tournament Sixteenth-finals', data[4].matches);

    it('Tournament should have the right number of matches', () => {
        assert.lengthOf(data[0].matches, 1);
        assert.lengthOf(data[1].matches, 2);
        assert.lengthOf(data[2].matches, 4);
        assert.lengthOf(data[3].matches, 8);
        assert.isTrue(data[4].matches.length === 16 || data[4].matches.length === 0);
    });
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
                if (item.hasOwnProperty(key) &&
                    key !== 'rank' && key !== 'country' && key !== 'team' && key !== 'name' &&
                    key !== 'logo' && key !== 'flag' && key !== 'goalDifference') {
                    assert.isFalse(isNaN(item[key]), 'Key "' + key + '" is not a number for item ' + index + ', with the value "' + item[key] + '"');
                }
            }
        });
    });
}