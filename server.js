'use strict';

const config = require('./server/config');
const helper = require('./server/helper');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const compression = require('compression');
const app = express();

// Middlewares configuration
const oneWeek = 604800000;
app.use(compression());
app.use(express.static('client/statics'));
app.use(express.static('client/images', { maxAge: oneWeek }));
app.use(express.static('dist', { maxAge: oneWeek }));

// Handlebars configuration
app.set('views', 'client/views');
app.set('view engine', '.ejs');
app.set('layout', 'commons/_layout');
app.use(expressLayouts);

// Starts application listening
app.listen(config.port, () => {
    helper.log('running on ' + config.port);
});

// Regsiters routes
app.use('/', require('./server/routes/manifestRoute'));
app.use('/', require('./server/routes/sitemapRoute'));
app.use('/', require('./server/routes/homeRoute'));
app.use('/', require('./server/routes/itemRoute'));

// Setup cron jobs
require('./server/cronJobs').setupCrons();