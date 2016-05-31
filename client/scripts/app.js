'use strict';

var MenuViewModel = require('./menu.viewmodel');

$(document).ready(function () {
    ko.applyBindings(new MenuViewModel(), document.getElementById('menu'));
});