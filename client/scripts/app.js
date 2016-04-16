'use strict';

var gridHelper = require('./helpers/grid.helper');
var ConfigurationViewModel = require('./viewmodels/configuration.viewmodel');

$(document).ready(function () {
    gridHelper.initializeGrid();
    ko.applyBindings(new ConfigurationViewModel(), document.getElementById('configuration'));
});