'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint'); // Check some coding rules
var jscs = require('gulp-jscs'); // Check some coding rules
var nodemon = require('gulp-nodemon'); // Start the node application

var resultsUpdater = require('./server/updaters/resultsUpdater');
var scorersUpdater = require('./server/updaters/scorersUpdater');
var assistsUpdater = require('./server/updaters/assistsUpdater');

// Updates results of current year
gulp.task('update-results', () => {
    resultsUpdater.updateCurrent();
});

// Updates results of old years
gulp.task('update-results-all', ['update-results'], () => {
    resultsUpdater.updateAll();
});

// Updates scorers of current year
gulp.task('update-scorers', () => {
    scorersUpdater.updateCurrent();
});

// Updates assists of current year
gulp.task('update-assists', () => {
    assistsUpdater.updateCurrent();
});

// Check coding rules
gulp.task('check', () => {
    gulp.src(['./*.js', './server/**/*.js', './public/js/**/*.js'])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

// Start the node server
gulp.task('start', () => {
    var options = {
        script: 'server/app.js',
        delayTime: 1,
        env: {
            'PORT': 5000
        },
        watch: ['./*.js', './server/*.js']
    };

    return nodemon(options).on('restart', () => {
        console.log('Restarting...');
    });
});