'use strict';

var leagues = require('../../../common/leagues');

function GridConfigurationViewModel() {
    var components = ko.observableArray();

    for (var item in leagues) {
        components.push({
            league: leagues[item],
            displayTable: ko.observable(false),
            displayTableMini: ko.observable(false),
            displayScorers: ko.observable(false),
            displayScorersMini: ko.observable(false),
            displayAssists: ko.observable(false),
            displayAssistsMini: ko.observable(false)
        });
    }

    return {
        components: components
    };
}

module.exports = GridConfigurationViewModel;