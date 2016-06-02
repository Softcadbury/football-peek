'use strict';

var config = require('./server/config');
var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

// Middlewares configuration
var oneWeek = 604800000;
app.use(express.static('build', { maxAge: oneWeek }));
app.use(express.static('data', { maxAge: oneWeek, extensions: ['png'] }));

// Handlebars configuration
app.set('views', 'client/views');
app.engine('.hbs', handlebars({ extname: '.hbs', partialsDir: ['client/views/components/', 'client/views/partials/'] }));
app.set('view engine', '.hbs');

// Starts application listening
app.listen(config.port, (err) => {
    console.log('running on ' + config.port);
});

// Regsiters routes
var indexRoutes = require('./server/routes/indexRoutes');
app.use('/', indexRoutes);