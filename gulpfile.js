'use strict';

var gulp = require('gulp');

// Updates tables
gulp.task('update-tables', () => {
    require('./server/updaters/tablesUpdater').update();
});

// Updates scorers
gulp.task('update-scorers', () => {
    require('./server/updaters/scorersUpdater').update();
});

// Updates assists
gulp.task('update-assists', () => {
    require('./server/updaters/assistsUpdater').update();
});

// Updates results
gulp.task('update-results', () => {
    require('./server/updaters/resultsUpdater').update();
});

// Updates all data except logos
gulp.task('update', ['update-tables', 'update-scorers', 'update-assists', 'update-results']);

// Check coding rules
gulp.task('check', () => {
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');
    gulp.src(['./*.js', './server/**/*.js', './tests/**/*.js', './client/scripts/**/*.js'])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

// Run tests
gulp.task('test', () => {
    var mocha = require('gulp-mocha');
    gulp.src('./tests/*.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }));
});

// Build the application
gulp.task('build', () => {
    var browserify = require('gulp-browserify');
    var uglify = require('gulp-uglify');
    gulp.src('client/scripts/app.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    var less = require('gulp-less');
    var minifyCSS = require('gulp-minify-css');
    var concatCss = require('gulp-concat-css');
    gulp.src('./client/styles/**/*.less')
        .pipe(less())
        .pipe(concatCss('app.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));

    gulp.src('./client/images/**/*')
        .pipe(gulp.dest('./build/images'));
});

// Start the node server
gulp.task('start', () => {
    var nodemon = require('gulp-nodemon');
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: { 'PORT': 5000 },
        watch: ['server']
    };

    return nodemon(options).on('restart', () => {
        console.log('Restarting...');
    });
});

// Manage build, start the node server and open the browser
gulp.task('default', ['build', 'start'], () => {
    gulp.watch(['./client/scripts/**/*', './client/styles/**/*'], ['build']);

    var openBrowser = require('gulp-open');
    gulp.src('/').pipe(openBrowser({ uri: '127.0.0.1:5000', app: 'chrome' }));
});