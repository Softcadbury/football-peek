'use strict';

var config = require('./server/config');
var items = require('./server/data/items');
var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

// Middlewares configuration
var oneWeek = 604800000;
app.use(express.static('build'));
app.use(express.static('data', { maxAge: oneWeek, extensions: ['png'] }));

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

// Restore isActive value for every items
app.use(function (req, res, next) {
    items.forEach(function (item) {
        item.isActive = false;
    });
    next();
});

// Regsiters routes
app.use('/', require('./server/routes/sitemapRoute'));
app.use('/', require('./server/routes/indexRoute'));
app.use('/', require('./server/routes/itemRoute'));