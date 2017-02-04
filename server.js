'use strict';

var config = require('./server/config');
var helper = require('./server/helper');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var compression = require('compression');
var app = express();

// Middlewares configuration
var tenMinutes = 600000;
app.use(compression());
app.use(express.static('dist', {
    maxAge: tenMinutes
}));

// Handlebars configuration
app.set('views', 'client/views');
app.set('view engine', '.ejs');
app.set('layout', '_layout');
app.use(expressLayouts);

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