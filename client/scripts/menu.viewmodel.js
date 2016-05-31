'use strict';

var leagues = require('../../data/leagues');

// View model used for the menu
function MenuViewModel() {
    var items = ko.observableArray();

    for (var item in leagues) {
        items.push(leagues[item]);
    }

    return {
        items: items
    };
}

module.exports = MenuViewModel;