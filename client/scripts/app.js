$(document).ready(function () {
    var gridster = $(".gridster").gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [100, 100]
    }).data('gridster');

    Add('/tables/premier-league/2015', 4, 4);

    Add('/tables/mini/premier-league/2015', 2, 2);
    Add('/assists/mini/premier-league/2015', 2, 2);
    Add('/scorers/mini/premier-league/2015', 2, 2);

    Add('/scorers/premier-league/2015', 3, 4);
    Add('/scorers/ligue-1/2015', 3, 4);
    Add('/scorers/bundesliga/2015', 3, 4);

    Add('/assists/premier-league/2015', 3, 4);
    Add('/assists/ligue-1/2015', 3, 4);
    Add('/assists/bundesliga/2015', 3, 4);

    function Add(url, sizeX, sizeY) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                gridster.add_widget.apply(gridster, [data, sizeX, sizeY]);
            }
        })
    }
});