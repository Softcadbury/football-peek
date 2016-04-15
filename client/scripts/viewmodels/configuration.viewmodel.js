'use strict';

var leagues = require('../../../common/leagues');
var ConfigurationLeagueViewModel = require('./configurationLeague.viewmodel');

// View model used to configure components of leagues
function ConfigurationViewModel() {
    var components = ko.observableArray();

    var $grid = $('#content').packery({
        itemSelector: '.component',
        gutter: 15,
        columnWidth: 25,
        rawHeight: 25
    });

    for (var item in leagues) {
        var component = new ConfigurationLeagueViewModel($grid, leagues[item]);
        components.push(component);
    }

    return {
        components: components
    };
}

module.exports = ConfigurationViewModel;