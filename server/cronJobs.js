'use strict';

var CronJob = require('cron').CronJob;
var mainUpdater = require('./updaters/mainUpdater');

var leagueCronJobTimes = [
    '00 00 09 * * *',
    '00 00 17 * * mon,fri,sat,sun',
    '00 00 19 * * mon,fri,sat,sun',
    '00 00 21 * * mon,fri,sat,sun',
    '00 30 22 * * mon,fri,sat,sun',
    '00 50 22 * * mon,fri,sat,sun',
    '00 10 23 * * mon,fri,sat,sun',
    '00 30 23 * * mon,fri,sat,sun',
    '00 50 23 * * *'
];

var competitionCronJobTimes = [
    '00 05 09 * * *',
    '00 05 19 * * tue,wed,thu',
    '00 05 21 * * tue,wed,thu',
    '00 35 22 * * tue,wed,thu',
    '00 55 22 * * tue,wed,thu',
    '00 15 23 * * tue,wed,thu',
    '00 35 23 * * tue,wed,thu',
    '00 55 23 * * *'
];

function setupCrons() {
    // Setup crons for leagues update
    leagueCronJobTimes.forEach(function (time) {
        (new CronJob(time, function () {
            console.log('Run league update');
            mainUpdater.updateLeague();
        }, null, false, 'Europe/Paris')).start();
    });

    // Setup crons for competitions update
    competitionCronJobTimes.forEach(function (time) {
        (new CronJob(time, function () {
            console.log('Run competition update');
            mainUpdater.updateCompetition();
        }, null, false, 'Europe/Paris')).start();
    });
}

module.exports = {
    setupCrons: setupCrons
};