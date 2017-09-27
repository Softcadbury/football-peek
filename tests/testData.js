/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');
var leagues = require('../server/data/leagues');

describe('Data intergrity', () => {
    items.forEach(item => {
        describe(item.name, () => {
            config.periods.availables.forEach(period => {
                describe(period, () => {
                    if (item.isCompetition) {
                        testTournamentData(item.code, period);
                        testGroupsData(item.code, period);
                    } else {
                        testTableData(item.code, period);
                        testResultData(item.code, period);
                    }

                    testScorersData(item.code, period);
                    testAssistsData(item.code, period);
                });
            });
        });
    });
});

function testTournamentData(code, period) {
    var path = helper.stringFormat(config.paths.tournamentData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    testDataIsNotEmpty('Tournament Final', data[0].matches);
    testDataIsNotEmpty('Tournament Semi-finals', data[1].matches);
    testDataIsNotEmpty('Tournament Quarter-finals', data[2].matches);
    testDataIsNotEmpty('Tournament Eighth-finals', data[3].matches);

    if (data.length === 5) {
        testDataIsNotEmpty('Tournament Sixteenth-finals', data[4].matches);
    }

    it('Tournament should have the right number of matches', () => {
        assert.lengthOf(data[0].matches, 1);
        assert.lengthOf(data[1].matches, 2);
        assert.lengthOf(data[2].matches, 4);
        assert.lengthOf(data[3].matches, 8);

        if (data.length === 5) {
            assert.isTrue(data[4].matches.length === 16);
        }
    });
}

function testGroupsData(code, period) {
    var path = helper.stringFormat(config.paths.groupsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    for (var i = 0; i < data.length; i++) {
        testDataIsNotEmpty('Group Matches' + i, data[i].matches);
        testDataIsNotEmpty('Group Table' + i, data[i].table);
        testDataIsNumber('Group Table' + i, data[i].table);

        ((j) => {
            it('Group should have the right number of matches', () => {
                assert.lengthOf(data[j].matches, 12);
                assert.lengthOf(data[j].table, 4);
            });
        })(i);
    }
}

function testTableData(code, period) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.tableData, code, period));
    testDataIsNotEmpty('Table', data);
    testDataIsNumber('Table', data);

    it('Table should have the right number of teams', () => {
        var expectedNumber = code === leagues.bundesliga.code ? 18 : 20;
        assert.lengthOf(data, expectedNumber);
    });
}

function testResultData(code, period) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, period));
    for (var i = 0; i < data.length; i++) {
        testDataIsNotEmpty('Result' + i, data[i].matches);
    }
}

function testScorersData(code, period) {
    var path = helper.stringFormat(config.paths.scorersData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    testDataIsNotEmpty('Scorers', data);
    testDataIsNumber('Scorers', data);

    it('Scorers should have the right number of players', () => {
        assert.isTrue(data.length >= 2);
    });
}

function testAssistsData(code, period) {
    var path = helper.stringFormat(config.paths.assistsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    testDataIsNotEmpty('Assists', data);
    testDataIsNumber('Assists', data);

    it('Assists should have the right number of players', () => {
        assert.isTrue(data.length >= 2);
    });
}

function testDataIsNotEmpty(dataName, data) {
    it(dataName + ' should not have empty data', () => {
        data.forEach((item, index) => {
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
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