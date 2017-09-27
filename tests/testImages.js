/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var fs = require('fs');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');

var spriteFileContent;

describe('Images intergrity', () => {
    spriteFileContent = fs.readFileSync('./client/styles/misc/sprite.css', 'utf8');

    items.forEach(item => {
        describe(item.name, () => {
            config.periods.availables.forEach(period => {
                describe(period, () => {
                    if (item.isCompetition) {
                        testTournamentImages(item.code, period);
                        testGroupImages(item.code, period);
                    } else {
                        testTableImages(item.code, period);
                        testResultsImages(item.code, period);
                    }

                    testScorersImages(item.code, period);
                    testAssistsImages(item.code, period);
                });
            });
        });
    });
});

function testTournamentImages(code, period) {
    var path = helper.stringFormat(config.paths.tournamentData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    testImagesExistance('Tournament Final', data[0].matches);
    testImagesExistance('Tournament Semi-finals', data[1].matches);
    testImagesExistance('Tournament Quarter-finals', data[2].matches);
    testImagesExistance('Tournament Eighth-finals', data[3].matches);

    if (data.length === 5) {
        testImagesExistance('Tournament Sixteenth-finals', data[4].matches);
    }
}

function testGroupImages(code, period) {
    var path = helper.stringFormat(config.paths.groupsData, code, period);

    if (!fileExists.sync(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    for (var i = 0; i < data.length; i++) {
        testImagesExistance('Group Matches' + i, data[i].matches);
        testImagesExistance('Group Table' + i, data[i].table);
    }
}

function testTableImages(code, period) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, period));
    testImagesExistance('Table', data);
}

function testResultsImages(code, period) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, period));
    testImagesExistance('Results', data[0].matches);
}

function testScorersImages(code, period) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, period));
    testImagesExistance('Scorers', data);
}

function testAssistsImages(code, period) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.assistsData, code, period));
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