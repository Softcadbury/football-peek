'use strict';

var configurationDataService = require('../dataservices/configuration.dataservice');
var gridHelper = require('../helpers/grid.helper');

// View model used to configure a component
function ConfigurationComponentViewModel(league, name, url, id) {
    var isDisplayed = ko.observable(false);

    // Toglle the display property of the component
    function toggleDisplayValue() {
        isDisplayed(!isDisplayed());

        if (isDisplayed()) {
            configurationDataService.addComponent(url, id);
            $.ajax({
                type: 'GET',
                url: (url + league.code),
                success: gridHelper.addComponent
            });
        } else {
            configurationDataService.removeComponents(url, id);
            gridHelper.removeComponent(id + league.code);
        }
    }

    return {
        name: name,
        isDisplayed: isDisplayed,
        toggleDisplayValue: toggleDisplayValue
    };
}

module.exports = ConfigurationComponentViewModel;