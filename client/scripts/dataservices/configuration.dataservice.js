'use strict';

// Gets components
function getComponents() {
    return JSON.parse(localStorage.getItem('components')) || [];
}

// Adds a component
function addComponent(url) {
    var components = getComponents();
    components.push({ url: url });
    localStorage.setItem('components', JSON.stringify(components));
}

// Removes a component
function removeComponents(url) {
    var components = getComponents().filter(function (component) {
        return component.url !== url;
    });
    localStorage.setItem('components', JSON.stringify(components));
}

module.exports = {
    getComponents: getComponents,
    addComponent: addComponent,
    removeComponents: removeComponents
};