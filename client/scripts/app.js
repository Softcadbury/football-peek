$(document).ready(function () {
    var gridster = $(".gridster > ul").gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [120, 120]
    }).data('gridster');

    Add('/tables/premier-league/2015', 3, 3);

    Add('/tables/mini/premier-league/2015', 2, 1);

    Add('/scorers/premier-league/2015', 3, 3);
    Add('/scorers/ligue-1/2015', 3, 3);
    Add('/scorers/bundesliga/2015', 3, 3);

    Add('/assists/premier-league/2015', 3, 3);
    Add('/assists/ligue-1/2015', 3, 3);
    Add('/assists/bundesliga/2015', 3, 3);

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