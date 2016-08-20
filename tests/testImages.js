/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var fs = require('fs');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');
var competitions = require('../server/data/competitions');

var spriteFileContent;

describe('Images intergrity', () => {
    spriteFileContent = fs.readFileSync('./client/styles/sprite.css', 'utf8');

    items.forEach(item => {
        describe(item.name, () => {
            config.years.availables.forEach(year => {
                describe(year, () => {
                    if (item.code === competitions.championsLeague.code || item.code === competitions.europaLeague.code) {
                        testTournamentImages(item.code, year);
                        testGroupImages(item.code, year);
                    } else {
                        testTableImages(item.code, year);
                        testResultsImages(item.code, year);
                    }

                    testScorersImages(item.code, year);
                    testAssistsImages(item.code, year);
                });
            });
        });
    });
});

function testTournamentImages(code, year) {
    var path = helper.stringFormat(config.paths.tournamentData, code, year);

    if (!fileExists(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    testImagesExistance('Tournament Final', data[0].matches);
    testImagesExistance('Tournament Semi-finals', data[1].matches);
    testImagesExistance('Tournament Quarter-finals', data[2].matches);
    testImagesExistance('Tournament Eighth-finals', data[3].matches);
    testImagesExistance('Tournament Sixteenth-finals', data[4].matches);
}

function testGroupImages(code, year) {
    var path = helper.stringFormat(config.paths.groupsData, code, year);

    if (!fileExists(path)) {
        return;
    }

    var data = helper.readJsonFile(path);
    for (var i = 0; i < data.length; i++) {
        testImagesExistance('Group Matches' + i, data[i].matches);
        testImagesExistance('Group Table' + i, data[i].table);
    }
}

function testTableImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));
    testImagesExistance('Table', data);
}

function testResultsImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, year));
    testImagesExistance('Results', data[0].matches);
}

function testScorersImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));
    testImagesExistance('Scorers', data);
}

function testAssistsImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.assistsData, code, year));
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