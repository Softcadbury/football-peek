'use strict';

var config = require('./config');
var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

// Middlewares configuration
app.use(express.static('build'));
app.use(express.static('data', { 'extensions': ['png', 'js'] }));

// Handlebars configuration
app.set('views', 'client/views');
app.engine('.hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// Starts application listening
app.listen(config.port, (err) => {
    console.log('running on ' + config.port);
});

// Starts crons
require('./crons/updaterCron').start();

// Regsiters routes
var indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

var tablesRoutes = require('./routes/tablesRoutes');
app.use('/tables', tablesRoutes);

var scorersRoutes = require('./routes/scorersRoutes');
app.use('/scorers', scorersRoutes);

var assistsRoutes = require('./routes/assistsRoutes');
app.use('/assists', assistsRoutes);

var resultsRoutes = require('./routes/resultsRoutes');
app.use('/results', resultsRoutes);