'use strict';

// Gets an url
function get(url) {
    var deferred = $.Deferred();

    $.ajax({
        type: 'GET',
        url: url
    })
    .done(deferred.resolve)
    .fail(deferred.reject);

    return deferred.promise();
}

module.exports = {
    get: get
};