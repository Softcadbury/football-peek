'use strict';

var gridHelper = require('../helpers/grid.helper');
var configurationDataService = require('../dataservices/configuration.dataservice');

// View model used to configure components of a specified league
function ConfigurationLeagueViewModel(league) {
    var displayTable = ko.observable(false);
    displayTable.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/tables/', '#table-'); });

    var displayTableMini = ko.observable(false);
    displayTableMini.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/tables/mini/', '#table-mini-'); });

    var displayScorers = ko.observable(false);
    displayScorers.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/scorers/', '#scorers-'); });

    var displayScorersMini = ko.observable(false);
    displayScorersMini.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/scorers/mini/', '#scorers-mini-'); });

    var displayAssists = ko.observable(false);
    displayAssists.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/assists/', '#assists-'); });

    var displayAssistsMini = ko.observable(false);
    displayAssistsMini.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/assists/mini/', '#assists-mini-'); });

    var displayResults = ko.observable(false);
    displayResults.subscribe(function (newValue) { manageNewDisplayValue(newValue, '/results/', '#results-'); });

    // Manage the new value of the display property
    function manageNewDisplayValue(newValue, url, id) {
        if (newValue) {
            configurationDataService.addComponent(url, id);
            $.ajax({
                type: 'GET',
                url: (url + league.code),
                success: gridHelper.addComponent
            });
        } else {
            configurationDataService.removeComponents(url, id);
            gridHelper.removeComponent(id + league.code);
        }
    }

    return {
        league: league,
        displayTable: displayTable,
        displayTableMini: displayTableMini,
        displayScorers: displayScorers,
        displayScorersMini: displayScorersMini,
        displayAssists: displayAssists,
        displayAssistsMini: displayAssistsMini,
        displayResults: displayResults
    };
}

module.exports = ConfigurationLeagueViewModel;