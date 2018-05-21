'use strict';

var CronJob = require('cron').CronJob;
var helper = require('./helper');
var mainUpdater = require('./updaters/mainUpdater');

// var leagueCronJobTimes = [
//     '00 00 09 * * *',
//     '00 40 15 * * sat,sun',
//     '00 30 16 * * sat,sun',
//     '00 20 17 * * sat,sun',
//     '00 10 18 * * sat,sun',
//     '00 00 19 * * sat,sun',
//     '00 00 20 * * sat,sun',
//     '00 00 21 * * mon,fri,sat,sun',
//     '00 30 22 * * mon,fri,sat,sun',
//     '00 50 22 * * mon,fri,sat,sun',
//     '00 10 23 * * *',
//     '00 30 23 * * *',
//     '00 50 23 * * *'
// ];

var competitionCronJobTimes = [
    '00 05 09 * * *',
    '00 05 19 * * tue,wed,thu',
    '00 05 21 * * tue,wed,thu',
    '00 35 22 * * tue,wed,thu',
    '00 55 22 * * tue,wed,thu',
    '00 15 23 * * *',
    '00 35 23 * * *',
    '00 55 23 * * *'
];

function setupCrons() {
    // /!\ Disable update until next year

    // Setup crons for leagues update
    // leagueCronJobTimes.forEach((time) => {
    //     (new CronJob(time, () => {
    //         helper.log('Run league update');
    //         mainUpdater.updateLeague();
    //     }, null, false, 'Europe/Paris')).start();
    // });

    // Setup crons for competitions update
    competitionCronJobTimes.forEach((time) => {
        (new CronJob(time, () => {
            helper.log('Run competition update');
            mainUpdater.updateCompetition();
        }, null, false, 'Europe/Paris')).start();
    });
}

module.exports = {
    setupCrons: setupCrons
};