'use strict';

var gulp = require('gulp');
var updater = require('./server/utils/updater');
var jshint = require('gulp-jshint'); // Check some coding rules
var jscs = require('gulp-jscs'); // Check some coding rules
var nodemon = require('gulp-nodemon'); // Start the node application

// Updates data of current year
gulp.task('update', () => {
    updater.updateCurrent();
});

// Updates data of old years
gulp.task('updateall', ['update'], () => {
    updater.updateAll();
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