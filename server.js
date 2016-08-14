'use strict';

var config = require('./server/config');
var items = require('./server/data/items');
var express = require('express');
var handlebars = require('express-handlebars');
var compression = require('compression');
var app = express();

// Middlewares configuration
app.use(compression());
app.use(express.static('build', { maxAge: config.cachePeriods.tenMinutes }));

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