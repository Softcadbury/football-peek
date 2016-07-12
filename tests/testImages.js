/* global describe, it */
'use strict';

var assert = require('chai').assert;
var fileExists = require('file-exists');
var config = require('../server/config');
var helper = require('../server/helper');
var items = require('../server/data/items');

describe('Images intergrity', () => {
    items.forEach(item => {
        describe(item.name, () => {
            config.years.availables.forEach(year => {
                describe(year, () => {
                    testTableImages(item.code, year);
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

function testImagesExistance(dataName, data) {
    it(dataName + ' should have existing images', () => {
        data.forEach((item, index) => {
            if (item.logo) {
                var logoPath = helper.stringFormat(config.paths.logosData, item.logo)
                assert.isTrue(fileExists(logoPath), 'Logo does not exist for item ' + index);
            }

            if (item.flag) {
                var flagPath = helper.stringFormat(config.paths.flagsData, item.flag)
                assert.isTrue(fileExists(flagPath), 'Flag does not exist for item ' + index);
            }
        });
    });
}