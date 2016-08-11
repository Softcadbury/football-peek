'use strict';

var yearsElement = document.getElementById('dropdown-content-years');
if (yearsElement) {
    yearsElement.style.display = 'none';
    document.addEventListener('click', function (e) {
        if (e.target.id === 'dropdown-arrow-years' || e.target.id === 'dropdown-label-years') {
            yearsElement.style.display = yearsElement.style.display === 'none' ? 'block' : 'none';
        } else {
            yearsElement.style.display = 'none';
        }
    });
}

var roundsElement = document.getElementById('dropdown-content-rounds');
if (roundsElement) {
    roundsElement.style.display = 'none';
    document.addEventListener('click', function (e) {
        if (e.target.id === 'dropdown-arrow-rounds' || e.target.id === 'dropdown-label-rounds') {
            roundsElement.style.display = roundsElement.style.display === 'none' ? 'block' : 'none';
        } else {
            roundsElement.style.display = 'none';
        }
    });
}