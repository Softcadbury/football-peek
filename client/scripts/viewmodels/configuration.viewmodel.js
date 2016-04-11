'use strict';

var leagues = require('../../../common/leagues');
var ConfigurationLeagueViewModel = require('./configurationLeague.viewmodel');

// View model used to configure components of leagues
function ConfigurationViewModel() {
    var components = ko.observableArray();

    var gridster = $('.gridster').gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [100, 100]
    }).data('gridster');

    for (var item in leagues) {
        var component = new ConfigurationLeagueViewModel(gridster, leagues[item]);
        components.push(component);
    }

    return {
        components: components
    };
}

module.exports = ConfigurationViewModel;