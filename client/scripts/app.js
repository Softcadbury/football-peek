'use strict';

var MenuViewModel = require('./viewmodels/menu.viewmodel');

$(document).ready(function () {
    ko.applyBindings(new MenuViewModel(), document.getElementById('menu'));
});