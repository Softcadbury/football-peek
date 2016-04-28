'use strict';

var gridHelper = require('../helpers/grid.helper');
var configurationDataService = require('../dataservices/configuration.dataservice');

// View model used to configure a component
function ConfigurationComponentViewModel(league, name, url, id) {
    var isDisplayed = ko.observable(false);
    var urlFull = url + league.code;
    var idFull = id + league.code;

    checkComponentDisplay();

    // Display the component if saved in the dataservice
    function checkComponentDisplay() {
        var isComponentDisplay = configurationDataService.getComponents().some(function (component) {
            return component.url === urlFull;
        });

        if (isComponentDisplay) {
            toggleDisplayValue();
        }
    }

    // Toglle the display property of the component
    function toggleDisplayValue() {
        isDisplayed(!isDisplayed());

        if (isDisplayed()) {
            configurationDataService.addComponent(urlFull);
            $.ajax({
                type: 'GET',
                url: urlFull,
                success: gridHelper.addComponent
            });
        } else {
            configurationDataService.removeComponents(urlFull);
            gridHelper.removeComponent(idFull);
        }
    }

    return {
        name: name,
        isDisplayed: isDisplayed,
        toggleDisplayValue: toggleDisplayValue
    };
}

module.exports = ConfigurationComponentViewModel;