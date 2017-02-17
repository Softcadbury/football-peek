/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
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
                        testGroupsData(item.code, year);
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

function testTournamentData(code, year) {
    var path = helper.stringFormat(config.paths.tournamentData, code, year);

    if (!fileExists(path)) {
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

function testGroupsData(code, year) {
    var path = helper.stringFormat(config.paths.groupsData, code, year);

    if (!fileExists(path)) {
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

function testTableData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.tableData, code, year));
    testDataIsNotEmpty('Table', data);
    testDataIsNumber('Table', data);

    it('Table should have the right number of teams', () => {
        var expectedNumber = code === leagues.bundesliga.code ? 18 : 20;
        assert.lengthOf(data, expectedNumber);
    });
}

function testResultData(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, year));
    for (var i = 0; i < data.length; i++) {
        testDataIsNotEmpty('Result' + i, data[i].matches);
    }
}

function testScorersData(code, year) {
    var path = helper.stringFormat(config.paths.scorersData, code, year);

    if (!fileExists(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    testDataIsNotEmpty('Scorers', data);
    testDataIsNumber('Scorers', data);

    it('Scorers should have the right number of players', () => {
        assert.isTrue(data.length >= 2);
    });
}

function testAssistsData(code, year) {
    var path = helper.stringFormat(config.paths.assistsData, code, year);

    if (!fileExists(path)) {
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
                if (item.hasOwnProperty(key) && key !== 'displayDate') {
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