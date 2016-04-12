'use strict';

var ConfigurationViewModel = require('./viewmodels/configuration.viewmodel');

$(document).ready(function () {
    ko.applyBindings(new ConfigurationViewModel(), document.getElementById('configuration'));
});