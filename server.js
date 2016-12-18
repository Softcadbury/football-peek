'use strict';

var config = require('./server/config');
var helper = require('./server/helper');
var express = require('express');
var handlebars = require('express-handlebars');
var compression = require('compression');
var app = express();

// Middlewares configuration
var tenMinutes = 600000;
app.use(compression());
app.use(express.static('build', {
    maxAge: tenMinutes
}));

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
    helper.log('running on ' + config.port);
});

// Regsiters routes
app.use('/', require('./server/routes/sitemapRoute'));
app.use('/', require('./server/routes/indexRoute'));
app.use('/', require('./server/routes/itemRoute'));

// Setup cron jobs
require('./server/cronJobs').setupCrons();