'use strict';

var leagues = require('../../../common/leagues');
var ConfigurationLeagueViewModel = require('./configurationLeague.viewmodel');

// View model used to configure components of leagues
function ConfigurationViewModel() {
    var components = ko.observableArray();

    for (var item in leagues) {
        var component = new ConfigurationLeagueViewModel(leagues[item]);
        components.push(component);
    }

    return {
        components: components
    };
}

module.exports = ConfigurationViewModel;