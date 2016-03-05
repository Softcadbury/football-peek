$(document).ready(function () {
    var gridster = $(".gridster").gridster({
        widget_margins: [5, 5],
        widget_base_dimensions: [100, 100]
    }).data('gridster');

    add('/tables/premier-league', 4, 4);

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
            success: function (data) {
                gridster.add_widget.apply(gridster, [data, sizeX, sizeY]);
            }
        })
    }
});