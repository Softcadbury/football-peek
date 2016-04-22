'use strict';

var CronJob = require('cron').CronJob;

// Starts the cron that update data every day at midnight
function start() {
    console.log('updater cron starting')
    new CronJob('0 0 * * * *', jobOnTick, null, true);
}

// Function called at cron ticks
function jobOnTick() {
    require('./server/updaters/tablesUpdater').update();
    require('./server/updaters/scorersUpdater').update();
    require('./server/updaters/assistsUpdater').update();
    require('./server/updaters/resultsUpdater').update();
}

module.exports = {
    start: start
};