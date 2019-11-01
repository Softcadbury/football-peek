'use strict';

const CronJob = require('cron').CronJob;
const helper = require('./helper');
const leagues = require('./data/leagues');
const competitions = require('./data/competitions');
const mainUpdater = require('./updaters/mainUpdater');

const leagueCronJobTimes = [
    '00 00 09 * * *',
    '00 40 15 * * sat,sun',
    '00 30 16 * * sat,sun',
    '00 20 17 * * sat,sun',
    '00 10 18 * * sat,sun',
    '00 00 19 * * sat,sun',
    '00 00 20 * * sat,sun',
    '00 00 21 * * mon,fri,sat,sun',
    '00 30 22 * * mon,fri,sat,sun',
    '00 50 22 * * mon,fri,sat,sun',
    '00 10 23 * * *',
    '00 30 23 * * *',
    '00 50 23 * * *'
];

const competitionCronJobTimes = [
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
    // Setup crons for leagues update
    leagueCronJobTimes.forEach(time => {
        (new CronJob(time, async () => {
            helper.log('Run league update');
            await mainUpdater.updateLeague(leagues.bundesliga);
            await mainUpdater.updateLeague(leagues.premierLeague);
            await mainUpdater.updateLeague(leagues.ligue1);
            await mainUpdater.updateLeague(leagues.serieA);
            await mainUpdater.updateLeague(leagues.liga);
        }, null, false, 'Europe/Paris')).start();
    });

    // Setup crons for competitions update
    competitionCronJobTimes.forEach(time => {
        (new CronJob(time, async () => {
            helper.log('Run competition update');
            await mainUpdater.updateCompetition(competitions.championsLeague);
            await mainUpdater.updateCompetition(competitions.europaLeague);
        }, null, false, 'Europe/Paris')).start();
    });
}

module.exports = {
    setupCrons
};