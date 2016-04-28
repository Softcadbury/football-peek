'use strict';

var configurationDataService = require('../dataservices/configuration.dataservice');
var ConfigurationComponentViewModel = require('./configurationComponent.viewmodel');

// View model used to configure components of a specified league
function ConfigurationLeagueViewModel(league) {
    var configurationComponents = ko.observableArray();

    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Table', '/tables/', '#table-'));
    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Table mini', '/tables/mini/', '#table-mini-'));
    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Scorers', '/scorers/', '#scorers-'));
    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Scorers mini', '/scorers/mini/', '#scorers-mini-'));
    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Assists', '/assists/', '#assists-'));
    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Assists mini', '/assists/mini/', '#assists-mini-'));
    configurationComponents.push(new ConfigurationComponentViewModel(league, 'Results', '/results/', '#results-'));

    return {
        league: league,
        configurationComponents: configurationComponents
    };
}

module.exports = ConfigurationLeagueViewModel;