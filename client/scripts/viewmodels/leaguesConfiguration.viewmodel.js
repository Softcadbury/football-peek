'use strict';

var leagues = require('../../../common/leagues');
var LeagueConfigurationViewModel = require('./leagueConfiguration.viewmodel');

// Viewmodel used to configure components of leagues
function LeaguesConfigurationViewModel() {
    var components = ko.observableArray();

    var gridster = $('.gridster').gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [100, 100]
    }).data('gridster');

    for (var item in leagues) {
        var component = new LeagueConfigurationViewModel(gridster, leagues[item]);
        components.push(component);
    }

    return {
        components: components
    };
}

module.exports = LeaguesConfigurationViewModel;