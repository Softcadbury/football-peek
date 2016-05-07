'use strict';

var leagues = require('../../../data/leagues');
var MenuLeagueViewModel = require('./menuLeague.viewmodel');

// View model used for the menu
function MenuViewModel() {
    var items = ko.observableArray();

    for (var item in leagues) {        
        var menuLeague = new MenuLeagueViewModel(leagues[item]);
        items.push(menuLeague);
    }

    return {
        items: items
    };
}

module.exports = MenuViewModel;