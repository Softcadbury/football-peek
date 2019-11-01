'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            const leftArrowElement = document.getElementsByClassName('icon-left-open')[0];

            if (leftArrowElement) {
                window.location = leftArrowElement.href;
            }
            break;
        case 39:
            const rightArrowElement = document.getElementsByClassName('icon-right-open')[0];

            if (rightArrowElement) {
                window.location = rightArrowElement.href;
            }
            break;
        default:
            break;
    }
};

const allTime = document.getElementsByClassName('time');

for (let i = 0; i < allTime.length; i++) {
    const time = allTime[i].dataset.time;
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    const offset = new Date().getTimezoneOffset() / 60;
    const newTime = ((hour - offset - 1) % 24) + ':' + minute;

    allTime[i].innerHTML = newTime;
}