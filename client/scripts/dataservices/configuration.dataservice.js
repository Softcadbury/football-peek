'use strict';

// Data service used to configure components of leagues
function configurationDataService() {
    function getConfiguration() {
        return JSON.parse(ko.toJSON(localStorage.configuration));
    }

    function saveConfiguration(configuration) {
        localStorage.configuration = JSON.stringify(ko.toJSON(configuration));
    }

    return {
        getConfiguration: getConfiguration,
        saveConfiguration: saveConfiguration
    };
}

module.exports = configurationDataService;