'use strict';

var config = require('./config');
var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

// Middlewares configuration
app.use(express.static('public'));

// Handlebars configuration
app.set('views', 'views');
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// Starts application listening
app.listen(config.port, (err) => {
    console.log('running on ' + config.port);
});

// Regsiters routes
var indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

var tableRoutes = require('./routes/tableRoutes');
app.use('/table', tableRoutes);

var tableRoutes = require('./routes/scorerRoutes');
app.use('/scorer', tableRoutes);