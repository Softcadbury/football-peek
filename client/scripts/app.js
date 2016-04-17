'use strict';

var gridHelper = require('./helpers/grid.helper');
var MenuViewModel = require('./viewmodels/menu.viewmodel');
var ConfigurationViewModel = require('./viewmodels/configuration.viewmodel');

$(document).ready(function () {
    gridHelper.initializeGrid();
    ko.applyBindings(new MenuViewModel(), document.getElementById('menu'));
    ko.applyBindings(new ConfigurationViewModel(), document.getElementById('configuration'));
});