/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');

describe('Data values', () => {
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
        testTournamentDataSpecific('Tournament Final', data[0], period);
    }

    if (data.length > 1) {
        testTournamentDataSpecific('Tournament Semi-finals', data[1], period);
    }

    if (data.length > 2) {
        testTournamentDataSpecific('Tournament Quarter-finals', data[2], period);
    }

    if (data.length > 3) {
        testTournamentDataSpecific('Tournament Eighth-finals', data[3], period);
    }

    if (data.length > 4) {
        testTournamentDataSpecific('Tournament Sixteenth-finals', data[4], period);
    }
}

function testTournamentDataSpecific(dataName, data, period) {
    it(dataName + ' should have the correct values', () => {
        assertValueIsNotEmpty(data, 'name');
        assertValueIsNotEmpty(data, 'matches');

        data.matches.forEach(item => {
            assertValuesAreNotEmpty(item, ['date1', 'team1', 'team2', 'winner', 'team1Logo', 'team2Logo']);
            assertScoresAreNotEmpty(item, ['score1', 'score2'], period);
        });
    });
}

function testGroupsData(code, period) {
    var path = helper.stringFormat(config.paths.groupsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Group should have the correct values', () => {
        data.forEach(item => {
            assertValueIsNotEmpty(item, 'name');
            assertValueIsNotEmpty(item, 'matches');
            assertValueIsNotEmpty(item, 'table');

            item.matches.forEach(match => {
                assertValuesAreNotEmpty(match, ['date', 'homeTeam', 'awayTeam', 'homeTeamLogo', 'awayTeamLogo']);
                assertScoresAreNotEmpty(match, ['score'], period);
            });

            item.table.forEach(table => {
                assertValuesAreNotEmpty(table, ['rank', 'team', 'points', 'played', 'win', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'logo']);
                assertValuesAreNumber(table, ['points', 'played', 'win', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference']);
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

    it('Table should have the correct values', () => {
        data.forEach(item => assertValuesAreNotEmpty(item, ['rank', 'team', 'points', 'played', 'win', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'logo']));
        data.forEach(item => assertValuesAreNumber(item, ['points', 'played', 'win', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference']));
    });
}

function testResultData(code, period) {
    var path = helper.stringFormat(config.paths.resultsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Result should have the correct values', () => {
        data.forEach(item => {
            assertValueIsNotEmpty(item, 'round');
            assertValueIsNotEmpty(item, 'matches');

            item.matches.forEach(match => {
                assertValuesAreNotEmpty(match, ['date', 'homeTeam', 'awayTeam', 'homeTeamLogo', 'awayTeamLogo']);
                assertScoresAreNotEmpty(match, ['score'], period);
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

    it('Scorers should have the correct values', () => {
        data.forEach(item => assertValuesAreNotEmpty(item, ['rank', 'name', 'country', 'team', 'goals', 'flag', 'logo']));
        data.forEach(item => assertValuesAreNumber(item, ['goals']));
    });
}

function testAssistsData(code, period) {
    var path = helper.stringFormat(config.paths.assistsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);

    it('Assists should have the correct values', () => {
        data.forEach(item => assertValuesAreNotEmpty(item, ['rank', 'name', 'country', 'team', 'assists', 'flag', 'logo']));
        data.forEach(item => assertValuesAreNumber(item, ['assists']));
    });
}

function assertValuesAreNotEmpty(item, keys) {
    keys.forEach(key => assertValueIsNotEmpty(item, key));
}

function assertValueIsNotEmpty(item, key) {
    assert.notEqual('', item[key], key + ' is empty');
}

function assertValuesAreNumber(item, keys) {
    keys.forEach(key => assertValueIsNumber(item, key));
}

function assertValueIsNumber(item, key) {
    assert.isFalse(isNaN(item[key]), key + ' is not a number');
}

function assertScoresAreNotEmpty(item, keys, period) {
    keys.forEach(key => assertScoreIsNotEmpty(item, key, period));
}

function assertScoreIsNotEmpty(item, key, period) {
    if (period === config.periods.current) {
        assertValueIsNotEmpty(item, key);
    } else {
        var isScoreEmpty = item[key] === '' || item[key] === '-:-';
        assert.isFalse(isScoreEmpty, key + ' is empty');
    }
}