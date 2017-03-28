'use strict';

var config = require('./server/config');
var helper = require('./server/helper');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var compression = require('compression');
var app = express();

// Middlewares configuration
var oneWeek = 604800000;
app.use(compression());
app.use(express.static('client/images', { maxAge: oneWeek }));
app.use(express.static('dist', { maxAge: oneWeek }));

// Handlebars configuration
app.set('views', 'client/views');
app.set('view engine', '.ejs');
app.set('layout', '_layout');
app.use(expressLayouts);

// Starts application listening
app.listen(config.port, () => {
    helper.log('running on ' + config.port);
});

// Regsiters routes
app.use('/', require('./server/routes/manifestRoute'));
app.use('/', require('./server/routes/sitemapRoute'));
app.use('/', require('./server/routes/indexRoute'));
app.use('/', require('./server/routes/itemRoute'));

// Setup cron jobs
require('./server/cronJobs').setupCrons();