'use strict';

var componentDataService = require('../dataservices/component.dataservice');

// View model used to manage components of a specified league
function ConfigurationLeagueViewModel(league) {
    var isSelected = ko.observable(false);
    
    function select(){
        componentDataService.getLeagueResults(league.code).done(function(data){
            $('#content-results').append(data);
        });
        
        componentDataService.getLeagueTable(league.code).done(function(data){
            $('#content-table').append(data);
        });
        
        componentDataService.getLeagueScorers(league.code).done(function(data){
            $('#content-scorers').append(data);
        });
        
        componentDataService.getLeagueAssists(league.code).done(function(data){
            $('#content-assists').append(data);
        });
    }
    
    return {
        league: league,
        isSelected: isSelected,
        select: select
    };
}

module.exports = ConfigurationLeagueViewModel;