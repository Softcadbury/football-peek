/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');
var competitions = require('../server/data/competitions');

describe('Images intergrity', () => {
    items.forEach(item => {
        describe(item.name, () => {
            config.years.availables.forEach(year => {
                describe(year, () => {
                    if (item.code === competitions.championsLeague.code || item.code === competitions.europaLeague.code) {
                        testTournamentImages(item.code, year);
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

function testTableImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));
    testImagesExistance('Table', data);
}

function testScorersImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.scorersData, code, year));
    testImagesExistance('Scorers', data);
}

function testAssistsImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.assistsData, code, year));
    testImagesExistance('Assists', data);
}

function testResultsImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.resultsData, code, year));
    testImagesExistance('Results', data);
}

function testTournamentImages(code, year) {
    var data = helper.readJsonFile(helper.stringFormat(config.paths.tournamentData, code, year));
    testImagesExistance('Tournament Final', data[0].matches);
    testImagesExistance('Tournament Semi-finals', data[1].matches);
    testImagesExistance('Tournament Quarter-finals', data[2].matches);
    testImagesExistance('Tournament Eighth-finals', data[3].matches);
    testImagesExistance('Tournament Sixteenth-finals', data[4].matches);
}

function testImagesExistance(dataName, data) {
    it(dataName + ' should have existing images', () => {
        data.forEach((item, index) => {
            if (item.flag) {
                var flagPath = helper.stringFormat(config.paths.flagsData, item.flag);
                assert.isTrue(fileExists(flagPath), 'Flag does not exist for item ' + index);
            }

            if (item.logo) {
                var logoPath = helper.stringFormat(config.paths.logosData, item.logo);
                assert.isTrue(fileExists(logoPath), 'Logo does not exist for item ' + index);
            }

            if (item.team1Logo) {
                var team1LogoPath = helper.stringFormat(config.paths.logosData, item.team1Logo);
                assert.isTrue(fileExists(team1LogoPath), 'Team 1 logo does not exist for item ' + index);
            }

            if (item.team2Logo) {
                var team2LogoPath = helper.stringFormat(config.paths.logosData, item.team2Logo);
                assert.isTrue(fileExists(team2LogoPath), 'Team 2 logo does not exist for item ' + index);
            }

            if (item.homeTeamLogo) {
                var homeTeamLogoPath = helper.stringFormat(config.paths.logosData, item.homeTeamLogo);
                assert.isTrue(fileExists(homeTeamLogoPath), 'Home team logo does not exist for item ' + index);
            }

            if (item.awayTeamLogo) {
                var awayTeamLogoPath = helper.stringFormat(config.paths.logosData, item.awayTeamLogo);
                assert.isTrue(fileExists(awayTeamLogoPath), 'Away team logo does not exist for item ' + index);
            }
        });
    });
}