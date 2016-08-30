'use strict';

var config = require('./server/config');
var items = require('./server/data/items');
var express = require('express');
var handlebars = require('express-handlebars');
var compression = require('compression');
var app = express();

// Set cron
var CronJob = require('cron').CronJob;
['00 00 19 * * *', '00 00 21 * * *', '00 00 23 * * *', '00 30 23 * * *'].forEach(function (time) {
    new CronJob(time, function () {
        console.log('Run league update');
        require('./server/updaters/mainUpdater').updateLeague();
    }, null, true, 'Europe/Paris');
})

['00 10 19 * * *', '00 10 21 * * *', '00 10 23 * * *', '00 40 23 * * *'].forEach(function (time) {
    new CronJob(time, function () {
        console.log('Run competition update');
        require('./server/updaters/mainUpdater').updateCompetition();
    }, null, true, 'Europe/Paris');
})

// Middlewares configuration
var tenMinutes = 600000;
app.use(compression());
app.use(express.static('build', { maxAge: tenMinutes }));

// Handlebars configuration
app.set('views', 'client/views');
app.engine('.hbs', handlebars({
    extname: '.hbs',
    partialsDir: ['client/views/partials/', 'client/views/components/'],
    defaultLayout: __dirname + '/client/views/_layout.hbs'
}));
app.set('view engine', '.hbs');

// Starts application listening
app.listen(config.port, (err) => {
    console.log('running on ' + config.port);
});

// Regsiters routes
app.use('/', require('./server/routes/sitemapRoute'));
app.use('/', require('./server/routes/indexRoute'));
app.use('/', require('./server/routes/itemRoute'));