/* global describe, it */
'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const config = require('../server/config');
const helper = require('../server/helper');
const items = require('../server/data/items');

let spriteFileContent;

describe('Images intergrity', () => {
    spriteFileContent = fs.readFileSync('./client/styles/misc/sprite.css', 'utf8');

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

    if (!fs.existsSync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    if (data.length > 0) {
        testImagesExistance('Tournament Final', data[0].matches);
    }

    if (data.length > 1) {
        testImagesExistance('Tournament Semi-finals', data[1].matches);
    }

    if (data.length > 2) {
        testImagesExistance('Tournament Quarter-finals', data[2].matches);
    }

    if (data.length > 3) {
        testImagesExistance('Tournament Eighth-finals', data[3].matches);
    }

    if (data.length > 4) {
        testImagesExistance('Tournament Sixteenth-finals', data[4].matches);
    }
}

function testGroupsData(code, period) {
    const path = helper.stringFormat(config.paths.groupsData, code, period);

    if (!fs.existsSync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    data.forEach(item => {
        testImagesExistance('Group Matches', item.matches);
        testImagesExistance('Group Table', item.table);
    });
}

function testTableData(code, period) {
    const path = helper.stringFormat(config.paths.tableData, code, period);

    if (!fs.existsSync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    testImagesExistance('Table', data);
}

function testResultData(code, period) {
    const path = helper.stringFormat(config.paths.resultsData, code, period);

    if (!fs.existsSync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    testImagesExistance('Results', data[0].matches);
}

function testScorersData(code, period) {
    const path = helper.stringFormat(config.paths.scorersData, code, period);

    if (!fs.existsSync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    testImagesExistance('Scorers', data);
}

function testAssistsData(code, period) {
    const path = helper.stringFormat(config.paths.assistsData, code, period);

    if (!fs.existsSync(path)) {
        return;
    }

    const data = helper.readJsonFile(path);

    testImagesExistance('Assists', data);
}

function testImagesExistance(dataName, data) {
    it(dataName + ' should have existing images', () => {
        data.forEach((item, index) => {
            assertImage(item.flag, 'Flag does not exist for item ' + index + ': ' + item.flag);
            assertImage(item.logo, 'Logo does not exist for item ' + index + ': ' + item.logo);
            assertImage(item.team1Logo, 'Team 1 logo does not exist for item ' + index + ': ' + item.team1Logo);
            assertImage(item.team2Logo, 'Team 2 logo does not exist for item ' + index + ': ' + item.team2Logo);
            assertImage(item.homeTeamLogo, 'Home team logo does not exist for item ' + index + ': ' + item.homeTeamLogo);
            assertImage(item.awayTeamLogo, 'Away team logo does not exist for item ' + index + ': ' + item.awayTeamLogo);
        });
    });
}

function assertImage(imageName, failureMessage) {
    if (imageName) {
        assert.isTrue(spriteFileContent.indexOf('icon-' + imageName) !== -1, failureMessage);
    }
}