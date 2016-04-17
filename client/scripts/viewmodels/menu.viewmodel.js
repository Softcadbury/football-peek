'use strict';

// View model used for the menu
function MenuViewModel() {
    // Toggle the visibility of the configuration
    function toggleConfigurationVisibility() {
        $('#configuration').toggle();
    }

    return {
        toggleConfigurationVisibility: toggleConfigurationVisibility
    };
}

module.exports = MenuViewModel;