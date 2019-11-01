/* global describe, it */
'use strict';

const assert = require('chai').assert;
const fileExists = require('file-exists');
const config = require('../server/config');
const helper = require('../server/helper');
const items = require('../server/data/items');

describe('Data lengths', () => {
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
    const path = helper.stringFormat(config.paths.tournamentData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    it('Tournament should have the right number of matches', () => {
        if (data.length > 0) {
            assert.lengthOf(data[0].matches, 1);
        }

        if (data.length > 1) {
            assert.lengthOf(data[1].matches, 2);
        }

        if (data.length > 2) {
            assert.lengthOf(data[2].matches, 4);
        }

        if (data.length > 3) {
            assert.lengthOf(data[3].matches, 8);
        }

        if (data.length > 4) {
            assert.lengthOf(data[4].matches, 16);
        }
    });
}

function testGroupsData(code, period) {
    const path = helper.stringFormat(config.paths.groupsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    it('Group should have the right number of teams', () => {
        data.forEach(item => {
            it('Group should have the right number of matches and teams', () => {
                if (item.table.length === 4) {
                    assert.lengthOf(item.matches, 12);
                } else if (item.table.length === 5) {
                    assert.lengthOf(item.matches, 10);
                } else {
                    assert.fail();
                }
            });
        });
    });
}

function testTableData(code, period) {
    const path = helper.stringFormat(config.paths.tableData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    it('Table should have the right number of teams', () => {
        assert.isTrue(data.length == 18 || data.length == 20);
    });
}

function testResultData(code, period) {
    const path = helper.stringFormat(config.paths.resultsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    it('Result should have the right number of matches', () => {
        assert.isTrue(data.length == 34 || data.length == 38);
    });
}

function testScorersData(code, period) {
    const path = helper.stringFormat(config.paths.scorersData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    it('Scorers should have the right number of players', () => {
        assert.lengthOf(data, 20);
    });
}

function testAssistsData(code, period) {
    const path = helper.stringFormat(config.paths.assistsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    it('Assists should have the right number of players', () => {
        assert.lengthOf(data, 20);
    });
}