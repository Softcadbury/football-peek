'use strict';

var contentElement = document.getElementById('dropdown-content-years');

if (contentElement) {
    contentElement.style.display = 'none';

    document.addEventListener("click", function (e) {
        if (e.target.id == 'dropdown-arrow-years' || e.target.id == 'dropdown-label-years') {
            contentElement.style.display = contentElement.style.display == 'none' ? 'block' : 'none';
        } else {
            contentElement.style.display = 'none';
        }
    });
}