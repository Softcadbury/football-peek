$(document).ready(function() {
    ko.applyBindings(new GridConfigurtionViewModel(), document.getElementById('test'));

    var gridster = $('.gridster').gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [100, 100]
    }).data('gridster');

    add('/tables/bundesliga', 4, 4);
    add('/tables/liga', 4, 4);
    add('/tables/ligue-1', 4, 4);
    add('/tables/premier-league', 4, 4);
    add('/tables/serie-a', 4, 4);

    add('/tables/mini/premier-league', 2, 2);
    add('/assists/mini/premier-league', 2, 2);
    add('/scorers/mini/premier-league', 2, 2);

    add('/scorers/premier-league', 3, 4);
    add('/scorers/ligue-1', 3, 4);
    add('/scorers/bundesliga', 3, 4);

    add('/assists/premier-league', 3, 4);
    add('/assists/ligue-1', 3, 4);
    add('/assists/bundesliga', 3, 4);

    function add(url, sizeX, sizeY) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                gridster.add_widget.apply(gridster, [data, sizeX, sizeY]);
            }
        });
    }
});

var leagues = {
    bundesliga: {
        code: 'bundesliga',
        name: 'Bundesliga'
    },
    liga: {
        code: 'liga',
        name: 'Liga'
    },
    ligue1: {
        code: 'ligue-1',
        name: 'Ligue 1'
    },
    premierLeague: {
        code: 'premier-league',
        name: 'Premier League'
    },
    serieA: {
        code: 'serie-a',
        name: 'Serie A'
    }
}

function GridConfigurtionViewModel() {    
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