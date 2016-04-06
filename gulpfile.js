'use strict';

var gulp = require('gulp');

// Updates data
gulp.task('update', () => {
    require('./server/updaters/tablesUpdater').update();
    require('./server/updaters/scorersUpdater').update();
    require('./server/updaters/assistsUpdater').update();
    require('./server/updaters/resultsUpdater').update();
});

// Updates logos
gulp.task('update-logos', () => {
    require('./server/updaters/logosUpdater').update();
});

// Check coding rules
gulp.task('check', () => {
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');
    gulp.src(['./*.js', './common/**/*.js', './server/**/*.js', './client/scripts/**/*.js'])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
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
    gulp.src('./client/styles/**/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));
});

// Inject js and css in views
gulp.task('inject', ['build'], function() {
    var inject = require('gulp-inject');
    var injectSrc = gulp.src(['./build/css/*.css', './build/js/*.js'], { read: false });
    var injectOptions = {
        ignorePath: '/build'
    };

    return gulp.src('./client/views/*.hbs')
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./client/views'));
});

// Start the node server
gulp.task('start', () => {
    var nodemon = require('gulp-nodemon');
    var options = {
        script: 'server/server.js',
        delayTime: 1,
        env: { 'PORT': 5000 },
        watch: ['server']
    };

    return nodemon(options).on('restart', () => {
        console.log('Restarting...');
    });
});

// Manage injection, start the node server and open the browser
gulp.task('default', ['inject', 'start'], () => {
    gulp.watch(['./common/**/*.js', './client/scripts/**/*', './client/styles/**/*'], ['inject']);

    var openBrowser = require('gulp-open');
    gulp.src('/').pipe(openBrowser({ uri: '127.0.0.1:5000', app: 'chrome' }));
});