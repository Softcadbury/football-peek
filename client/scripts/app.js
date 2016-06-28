'use strict';

$(document).ready(function () {
    $(document).on('mouseup', function (e) {
        if ($(e.target).is('#dropdown-label-years') || $(e.target).is('#dropdown-arrow-years')) {
            $("#dropdown-content-years").toggle();
        } else {
            $("#dropdown-content-years").hide();
        }        
    });
});