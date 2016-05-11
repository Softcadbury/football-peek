'use strict';

var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);

// var config = require('./server/config');
// var express = require('express');
// var handlebars = require('express-handlebars');
// var app = express();

// // Middlewares configuration
// app.use(express.static('build'));
// app.use(express.static('data', { 'extensions': ['png', 'js'] }));

// // Handlebars configuration
// app.set('views', 'client/views');
// app.engine('.hbs', handlebars({ extname: '.hbs' }));
// app.set('view engine', '.hbs');

// // Starts application listening
// app.listen(config.port, (err) => {
//     console.log('running on ' + config.port);
// });

// // Starts crons
// require('./server/crons/updaterCron').start();

// // Regsiters routes
// var indexRoutes = require('./server/routes/indexRoutes');
// app.use('/', indexRoutes);

// var componentsRoutes = require('./server/routes/componentsRoutes');
// app.use('/components', componentsRoutes);