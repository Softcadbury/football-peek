'use strict';

// View model used for the menu
function MenuViewModel() {
    var isConfigurationToggled = ko.observable(false);

    // Toggle the visibility of the configuration
    function toggleConfigurationVisibility() {
        isConfigurationToggled(!isConfigurationToggled());
        $('#configuration').toggle();
    }

    return {
        isConfigurationToggled: isConfigurationToggled,
        toggleConfigurationVisibility: toggleConfigurationVisibility
    };
}

module.exports = MenuViewModel;