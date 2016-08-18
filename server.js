'use strict';

var config = require('./server/config');
var items = require('./server/data/items');
var leagues = require('./server/data/leagues');
var helper = require('./server/helper');
var express = require('express');
var handlebars = require('express-handlebars');
var compression = require('compression');
var app = express();

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

// Set leagues rounds
leagues.bundesliga.round = helper.getLeagueRound(leagues.bundesliga.code);
leagues.liga.round = helper.getLeagueRound(leagues.liga.code);
leagues.ligue1.round = helper.getLeagueRound(leagues.ligue1.code);
leagues.premierLeague.round = helper.getLeagueRound(leagues.premierLeague.code);
leagues.serieA.round = helper.getLeagueRound(leagues.serieA.code);

// Starts application listening
app.listen(config.port, (err) => {
    console.log('running on ' + config.port);
});

// Regsiters routes
app.use('/', require('./server/routes/sitemapRoute'));
app.use('/', require('./server/routes/indexRoute'));
app.use('/', require('./server/routes/itemRoute'));