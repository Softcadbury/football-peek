'use strict';

initDropdown('dropdown-label-years', 'dropdown-arrow-years', 'dropdown-content-years');
initDropdown('dropdown-label-rounds', 'dropdown-arrow-rounds', 'dropdown-content-rounds');

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

displayRound();
window.onhashchange = displayRound;

function displayRound() {
    var roundRequested = location.hash.replace('#/round-', '') || 1;
    var label = document.getElementById('dropdown-label-rounds');
    var rounds = document.getElementsByClassName('round-content');

    if (!label) {
        return;
    }

    label.innerHTML = 'Round ' + roundRequested;

    for (var i = 0; i < rounds.length; i++) {
        if (rounds[i].className.indexOf('round-' + roundRequested + '-content') != -1) {
            rounds[i].style.display = '';
        } else {
            rounds[i].style.display = 'none';
        }
    }
}