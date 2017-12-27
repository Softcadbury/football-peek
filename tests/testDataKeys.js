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
        assertKey(data, 'name');
        assertKey(data, 'matches');

        data.matches.forEach(item => {
            assertKeys(item, ['date1', 'team1', 'team2', 'score1', 'winner', 'team1Logo', 'team2Logo']);
            assert.equal(item.hasOwnProperty('date2'), item.hasOwnProperty('score2'), 'date2 & score2');
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
            assertKey(item, 'name');
            assertKey(item, 'matches');
            assertKey(item, 'table');

            item.matches.forEach(match => assertKeys(match, ['date', 'homeTeam', 'awayTeam', 'score', 'homeTeamLogo', 'awayTeamLogo']));
            item.table.forEach(table => assertKeys(table, ['rank', 'team', 'points', 'played', 'win', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'logo']));
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
        data.forEach(item => assertKeys(item, ['rank', 'team', 'points', 'played', 'win', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'logo']));
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
            assertKey(item, 'round');
            assertKey(item, 'matches');

            item.matches.forEach(match => assertKeys(match, ['date', 'homeTeam', 'awayTeam', 'score', 'homeTeamLogo', 'awayTeamLogo']));
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
        data.forEach(item => assertKeys(item, ['rank', 'name', 'country', 'team', 'goals', 'flag', 'logo']));
    });
}

function testAssistsData(code, period) {
    var path = helper.stringFormat(config.paths.assistsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Assists should have the correct keys', () => {
        data.forEach(item => assertKeys(item, ['rank', 'name', 'country', 'team', 'assists', 'flag', 'logo']));
    });
}

function assertKeys(item, keys) {
    keys.forEach(key => assertKey(item, key));
}

function assertKey(item, key) {
    assert.isTrue(item.hasOwnProperty(key), key + ' is missing');
}