'use strict';

var leagues = require('../../data/leagues');

// View model used for the menu
function MenuViewModel() {
    var items = ko.observableArray();

    for (var item in leagues) {
        items.push(leagues[item]);
    }

    // Use to know if the league is selected
    function isSelected(league) {
        var url = window.location.pathname.replace(/\//g, '');
        return league.code == (url ? url : leagues.bundesliga.code);
    }

    return {
        items: items,
        isSelected: isSelected
    };
}

module.exports = MenuViewModel;