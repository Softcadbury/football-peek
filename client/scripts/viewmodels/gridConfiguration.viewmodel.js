'use strict';

var leagues = require('../../../common/leagues');

function GridConfigurationViewModel() {
    var components = ko.observableArray();

    var gridster = $('.gridster').gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [100, 100]
    }).data('gridster');

    for (var item in leagues) {
        var component = {
            league: leagues[item],
            displayTable: ko.observable(false),
            displayTableMini: ko.observable(false),
            displayScorers: ko.observable(false),
            displayScorersMini: ko.observable(false),
            displayAssists: ko.observable(false),
            displayAssistsMini: ko.observable(false)
        };

        (function(code) {
            component.displayTable.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/tables/' + code, '#table-' + code, 4, 4); });
            component.displayTableMini.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/tables/mini/' + code, '#table-mini-' + code, 2, 2); });
            component.displayScorers.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/scorers/' + code, '#scorers-' + code, 3, 4); });
            component.displayScorersMini.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/scorers/mini/' + code, '#scorers-mini-' + code, 2, 2); });
            component.displayAssists.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/assists/' + code, '#assists-' + code, 3, 4); });
            component.displayAssistsMini.subscribe(function(newValue) { manageNewDisplayValue(newValue, '/assists/mini/' + code, '#assists-mini-' + code, 2, 2); });
        })(leagues[item].code);

        components.push(component);
    }

    // Manage the new value of the display
    function manageNewDisplayValue(newValue, url, id, sizeX, sizeY) {
        if (newValue) {
            add(url, sizeX, sizeY);
        } else {
            gridster.remove_widget($(id));
        }
    }

    // Add a component in the grid
    function add(url, sizeX, sizeY) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                gridster.add_widget.apply(gridster, [data, sizeX, sizeY]);
            }
        });
    }

    return {
        components: components
    };
}

module.exports = GridConfigurationViewModel;