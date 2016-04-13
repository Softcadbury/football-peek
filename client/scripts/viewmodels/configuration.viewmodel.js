'use strict';

var leagues = require('../../../common/leagues');
var ConfigurationLeagueViewModel = require('./configurationLeague.viewmodel');

// View model used to configure components of leagues
function ConfigurationViewModel() {
    var components = ko.observableArray();

    var $grid = $('.grid').packery({
        itemSelector: '.grid-item',
        gutter: 10,
        columnWidth: 200,
        rawHeight: 200
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