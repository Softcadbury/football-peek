'use strict';

var $grid;

// Initializes the grid with packery
function initializeGrid() {
    $grid = $('#content').packery({
        itemSelector: '.component',
        gutter: 15,
        columnWidth: 15,
        rawHeight: 15
    });
}

// Adds a component in the packery grid
function addComponent(content) {
    var $item = $(content);
    $grid.append($item).packery('appended', $item);
    $grid.packery('bindUIDraggableEvents', $item.draggable());
}

// Removes a component in the packery grid
function removeComponent(id) {
    $grid.packery('remove', $(id));
}

module.exports = {
    initializeGrid: initializeGrid,
    addComponent: addComponent,
    removeComponent: removeComponent
};