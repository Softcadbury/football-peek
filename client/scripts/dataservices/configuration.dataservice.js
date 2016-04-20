'use strict';

// Gets components
function getComponents() {
    return JSON.parse(localStorage.getItem('components'));
}

// Adds a component
function addComponent(url, id) {
    var components = getComponents() || [];
    components.push({ url: url, id: id });
    localStorage.setItem('components', JSON.stringify(components));
}

// Removes a component
function removeComponents(url, id) {
    var components = getComponents() || [];
    components = components.filter(function (component) {
        return component.url !== url && component.id !== url;
    });
    localStorage.setItem('components', JSON.stringify(components));
}

module.exports = {
    getComponents: getComponents,
    addComponent: addComponent,
    removeComponents: removeComponents
};