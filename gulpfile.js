'use strict';

var gulp = require('gulp');

// Updates data
// Format: gulp up / gulp up -l / gulp up -c / gulp up -l eng
gulp.task('up', () => {
    var argv = require('yargs').argv;
    var leagueArg = argv.l;
    var competitionArg = argv.c;

    require('./server/updaters/mainUpdater').updateLeague(leagueArg);
    require('./server/updaters/mainUpdater').updateCompetition(competitionArg);
});

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

// Build the sprite
gulp.task('sprite', () => {
    var spritesmith = require('gulp.spritesmith');
    var spritesmithOptions = spritesmith({
        imgName: 'images/sprite.png',
        cssName: 'styles/sprite.css'
    });

    gulp.src(['data/images/**/*.gif', 'data/images/**/*.png'])
        .pipe(spritesmithOptions)
        .pipe(gulp.dest('./client'));
});

// Build the application
gulp.task('build', () => {
    // Javascript
    var browserify = require('gulp-browserify');
    var uglify = require('gulp-uglify');
    gulp.src('client/scripts/app.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));

    // Css
    var less = require('gulp-less');
    var minifyCSS = require('gulp-minify-css');
    var concatCss = require('gulp-concat-css');
    gulp.src('./client/styles/**/*')
        .pipe(less())
        .pipe(concatCss('app.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/css'));

    // Images
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
        watch: ['server.js']
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