'use strict';

var LeaguesConfigurationViewModel = require('./viewmodels/leaguesConfiguration.viewmodel');

$(document).ready(function() {
    ko.applyBindings(new LeaguesConfigurationViewModel(), document.getElementById('leagues-configuration'));
});