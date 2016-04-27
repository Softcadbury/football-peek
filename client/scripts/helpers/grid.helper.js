'use strict';

var $grid;

// Initializes the grid with packery
function initializeGrid() {
    $grid = $('#content').packery({
        itemSelector: '.component',
        columnWidth: 235,
        rowHeight: 235,
        gutter: 5
    });
}

// Adds a component in the packery grid
function addComponent(content) {
    var $item = $(content);
    $grid.append($item).packery('appended', $item);
    $grid.packery('bindUIDraggableEvents', $item.draggable());
    $grid.packery('layout');
}

// Removes a component in the packery grid
function removeComponent(id) {
    $grid.packery('remove', $(id));
    $grid.packery('layout');
}

module.exports = {
    initializeGrid: initializeGrid,
    addComponent: addComponent,
    removeComponent: removeComponent
};