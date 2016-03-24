'use strict';

var GridConfigurationViewModel = require('./viewmodels/gridConfiguration.viewmodel');

$(document).ready(function() {
    ko.applyBindings(new GridConfigurationViewModel(), document.getElementById('grid-configuration'));
});