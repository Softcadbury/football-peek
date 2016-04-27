'use strict';

var leagues = require('../../../data/leagues');
var ConfigurationLeagueViewModel = require('./configurationLeague.viewmodel');

// View model used to configure components of leagues
function ConfigurationViewModel() {
    var configurationLeagues = ko.observableArray();

    for (var item in leagues) {
        var configurationLeague = new ConfigurationLeagueViewModel(leagues[item]);
        configurationLeagues.push(configurationLeague);
    }

    return {
        configurationLeagues: configurationLeagues
    };
}

module.exports = ConfigurationViewModel;