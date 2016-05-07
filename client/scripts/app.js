'use strict';

var MenuViewModel = require('./viewmodels/menu.viewmodel');
var componentDataService = require('./dataservices/component.dataservice');

$(document).ready(function () {
    //ko.applyBindings(new MenuViewModel(), document.getElementById('menu'));
    
    componentDataService.getLeagueResults('bundesliga').done(function(data){
        $('#content-results').append(data);
    });
    
    componentDataService.getLeagueTable('bundesliga').done(function(data){
        $('#content-table').append(data);
    });
    
    componentDataService.getLeagueScorers('bundesliga').done(function(data){
        $('#content-scorers').append(data);
    });
    
    componentDataService.getLeagueAssists('bundesliga').done(function(data){
        $('#content-assists').append(data);
    });
});