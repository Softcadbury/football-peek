'use strict';

var gulp = require('gulp');

var resultsUpdater = require('./server/updaters/resultsUpdater');
var tablesUpdater = require('./server/updaters/tablesUpdater');
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

// Updates tables of current year
gulp.task('update-tables', () => {
    tablesUpdater.updateCurrent();
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
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');

    gulp.src(['./*.js', './server/**/*.js', './client/scripts/**/*.js'])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

// Build the application
gulp.task('build', () => {
    var uglify = require('gulp-uglify');
    gulp.src('./client/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    var less = require('gulp-less');
    var minifyCSS = require('gulp-minify-css');
    gulp.src('./client/styles/**/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));
});

// Start the node server
gulp.task('start', ['build'], () => {
    var nodemon = require('gulp-nodemon');
    var options = {
        script: 'server/server.js',
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