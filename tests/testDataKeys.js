/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');

describe('Data keys', () => {
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

    if (data.length > 0) {
        testTournamentDataSpecific('Tournament Final', data[0]);
    }

    if (data.length > 1) {
        testTournamentDataSpecific('Tournament Semi-finals', data[1]);
    }

    if (data.length > 2) {
        testTournamentDataSpecific('Tournament Quarter-finals', data[2]);
    }

    if (data.length > 3) {
        testTournamentDataSpecific('Tournament Eighth-finals', data[3]);
    }

    if (data.length > 4) {
        testTournamentDataSpecific('Tournament Sixteenth-finals', data[4]);
    }
}

function testTournamentDataSpecific(dataName, data) {
    it(dataName + ' should have the correct keys', () => {
        assert.isTrue(data.hasOwnProperty('name'));
        assert.isTrue(data.hasOwnProperty('matches'));

        data.matches.forEach(item => {
            assert.isTrue(item.hasOwnProperty('date1'));
            assert.isTrue(item.hasOwnProperty('team1'));
            assert.isTrue(item.hasOwnProperty('team2'));
            assert.isTrue(item.hasOwnProperty('score1'));
            assert.isTrue(item.hasOwnProperty('winner'));
            assert.isTrue(item.hasOwnProperty('team1Logo'));
            assert.isTrue(item.hasOwnProperty('team2Logo'));

            assert.isTrue(item.hasOwnProperty('date2') === item.hasOwnProperty('score2'));
        });
    });
}

function testGroupsData(code, period) {
    var path = helper.stringFormat(config.paths.groupsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Group should have the correct keys', () => {
        data.forEach(item => {
            assert.isTrue(item.hasOwnProperty('name'));
            assert.isTrue(item.hasOwnProperty('matches'));
            assert.isTrue(item.hasOwnProperty('table'));

            item.matches.forEach(match => {
                assert.isTrue(match.hasOwnProperty('date'));
                assert.isTrue(match.hasOwnProperty('homeTeam'));
                assert.isTrue(match.hasOwnProperty('awayTeam'));
                assert.isTrue(match.hasOwnProperty('score'));
                assert.isTrue(match.hasOwnProperty('homeTeamLogo'));
                assert.isTrue(match.hasOwnProperty('awayTeamLogo'));
            });

            item.table.forEach(table => {
                assert.isTrue(table.hasOwnProperty('rank'));
                assert.isTrue(table.hasOwnProperty('team'));
                assert.isTrue(table.hasOwnProperty('points'));
                assert.isTrue(table.hasOwnProperty('played'));
                assert.isTrue(table.hasOwnProperty('win'));
                assert.isTrue(table.hasOwnProperty('draw'));
                assert.isTrue(table.hasOwnProperty('lost'));
                assert.isTrue(table.hasOwnProperty('goalsFor'));
                assert.isTrue(table.hasOwnProperty('goalsAgainst'));
                assert.isTrue(table.hasOwnProperty('goalDifference'));
                assert.isTrue(table.hasOwnProperty('logo'));
            });
        });
    });
}

function testTableData(code, period) {
    var path = helper.stringFormat(config.paths.tableData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Table should have the correct keys', () => {
        data.forEach(item => {
            assert.isTrue(item.hasOwnProperty('rank'));
            assert.isTrue(item.hasOwnProperty('team'));
            assert.isTrue(item.hasOwnProperty('points'));
            assert.isTrue(item.hasOwnProperty('played'));
            assert.isTrue(item.hasOwnProperty('win'));
            assert.isTrue(item.hasOwnProperty('draw'));
            assert.isTrue(item.hasOwnProperty('lost'));
            assert.isTrue(item.hasOwnProperty('goalsFor'));
            assert.isTrue(item.hasOwnProperty('goalsAgainst'));
            assert.isTrue(item.hasOwnProperty('goalDifference'));
            assert.isTrue(item.hasOwnProperty('logo'));
        });
    });
}

function testResultData(code, period) {
    var path = helper.stringFormat(config.paths.resultsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Result should have the correct keys', () => {
        data.forEach(item => {
            assert.isTrue(item.hasOwnProperty('round'));
            assert.isTrue(item.hasOwnProperty('matches'));

            item.matches.forEach(match => {
                assert.isTrue(match.hasOwnProperty('date'));
                assert.isTrue(match.hasOwnProperty('homeTeam'));
                assert.isTrue(match.hasOwnProperty('awayTeam'));
                assert.isTrue(match.hasOwnProperty('score'));
                assert.isTrue(match.hasOwnProperty('homeTeamLogo'));
                assert.isTrue(match.hasOwnProperty('awayTeamLogo'));
            });
        });
    });
}

function testScorersData(code, period) {
    var path = helper.stringFormat(config.paths.scorersData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Scorers should have the correct keys', () => {
        data.forEach(item => {
            assert.isTrue(item.hasOwnProperty('rank'));
            assert.isTrue(item.hasOwnProperty('name'));
            assert.isTrue(item.hasOwnProperty('country'));
            assert.isTrue(item.hasOwnProperty('team'));
            assert.isTrue(item.hasOwnProperty('goals'));
            assert.isTrue(item.hasOwnProperty('flag'));
            assert.isTrue(item.hasOwnProperty('logo'));
        });
    });
}

function testAssistsData(code, period) {
    var path = helper.stringFormat(config.paths.assistsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Assists should have the correct keys', () => {
        data.forEach(item => {
            assert.isTrue(item.hasOwnProperty('rank'));
            assert.isTrue(item.hasOwnProperty('name'));
            assert.isTrue(item.hasOwnProperty('country'));
            assert.isTrue(item.hasOwnProperty('team'));
            assert.isTrue(item.hasOwnProperty('assists'));
            assert.isTrue(item.hasOwnProperty('flag'));
            assert.isTrue(item.hasOwnProperty('logo'));
        });
    });
}