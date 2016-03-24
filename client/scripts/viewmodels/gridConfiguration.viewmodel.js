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

        (function(league) {
            component.displayTable.subscribe(function(newValue) {
                if (newValue) {
                    add('/tables/' + league.code, 4, 4);
                    add('/tables/mini/' + league.code, 2, 2);
                    add('/scorers/' + league.code, 3, 4);
                    add('/scorers/mini/' + league.code, 2, 2);
                    add('/assists/' + league.code, 3, 4);
                    add('/assists/mini/' + league.code, 2, 2);
                } else {
                    // todo remove component
                }
            });
        })(leagues[item]);

        components.push(component);
    }

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