'use strict';

initDropdown('dropdown-label-years', 'dropdown-arrow-years', 'dropdown-content-years');
initDropdown('dropdown-label-rounds', 'dropdown-arrow-rounds', 'dropdown-content-rounds');
initDropdown('dropdown-label-groups', 'dropdown-arrow-groups', 'dropdown-content-groups');

manageRoundsDropdown();
manageGroupsDropdown();

window.onhashchange = function () {
    manageRoundsDropdown();
    manageGroupsDropdown();
};

function initDropdown(labelId, arrowId, contentId) {
    var contentElement = document.getElementById(contentId);
    if (contentElement) {
        contentElement.style.display = 'none';
        document.addEventListener('click', function (e) {
            if (e.target.id === arrowId || e.target.id === labelId) {
                contentElement.style.display = contentElement.style.display === 'none' ? 'block' : 'none';
            } else {
                contentElement.style.display = 'none';
            }
        });
    }
}

function manageRoundsDropdown() {
    var roundLabel = document.getElementById('dropdown-label-rounds');

    if (roundLabel) {
        var roundRequested = location.hash.replace('#/round-', '') || window.currentRound || 1;

        // Set component title
        roundLabel.innerHTML = 'Round ' + roundRequested;

        // Init previous button
        var previous = document.getElementById('arrow-rounds-previous');
        if (roundRequested > 1) {
            var previousRound = parseInt(roundRequested, 10) - 1;
            previous.setAttribute('href', '#/round-' + previousRound);
            previous.style.display = '';
        } else {
            previous.style.display = 'none';
        }

        // Init next button
        var next = document.getElementById('arrow-rounds-next');
        if (roundRequested < window.numberOfRounds) {
            var nextRound = parseInt(roundRequested, 10) + 1;
            next.setAttribute('href', '#/round-' + nextRound);
            next.style.display = '';
        } else {
            next.style.display = 'none';
        }
    }
}

function manageGroupsDropdown() {
    var groupLabel = document.getElementById('dropdown-label-groups');

    if (groupLabel) {
        var groupRequested = location.hash.replace('#/group-', '') || 'a';
        var groupRequestedIndex = groupRequested.charCodeAt(0);

        // Set component title
        groupLabel.innerHTML = 'Group ' + groupRequested;

        // Init previous button
        var previous = document.getElementById('arrow-groups-previous');
        if (groupRequestedIndex > 96 + 1) {
            var previousGroup = String.fromCharCode(groupRequestedIndex - 1);
            previous.setAttribute('href', '#/group-' + previousGroup);
            previous.style.display = '';
        } else {
            previous.style.display = 'none';
        }

        // Init next button
        var next = document.getElementById('arrow-groups-next');
        if (groupRequestedIndex < 96 + window.numberOfGroups) {
            var nextGroup = String.fromCharCode(groupRequestedIndex + 1);
            next.setAttribute('href', '#/group-' + nextGroup);
            next.style.display = '';
        } else {
            next.style.display = 'none';
        }
    }
}