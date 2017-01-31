'use strict';

var gulp = require('gulp');

// Updates data
// Format: gulp up -l [lague small name] -c [competition small name]
gulp.task('up', () => {
    var config = require('./server/config');
    config.downloadImages = true;

    var argv = require('yargs').argv;
    var leagueArg = argv.l;
    var competitionArg = argv.c;

    if (leagueArg) {
        require('./server/updaters/mainUpdater').updateLeague(leagueArg);
    }

    if (competitionArg) {
        require('./server/updaters/mainUpdater').updateCompetition(competitionArg);
    }
});

// Check coding rules
gulp.task('lint', () => {
    var eslint = require('gulp-eslint');
    return gulp.src(['**/*.js', '!node_modules/**', '!public/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
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
        cssName: 'client/styles/miscs/sprite.css',
        imgName: 'public/images/sprite.png',
        imgPath: '../../images/sprite.png'
    });

    gulp.src(['data/images/**/*.gif', 'data/images/**/*.png'])
        .pipe(spritesmithOptions)
        .pipe(gulp.dest('.'));
});

// Clean built files
gulp.task('clean', (cb) => {
    var rimraf = require('rimraf');
    rimraf('./public/js', cb);
});

// Build the application in the public folder
gulp.task('build', ['clean'], () => {
    var less = require('gulp-less');
    var minifyCSS = require('gulp-minify-css');
    var concatCss = require('gulp-concat-css');
    gulp.src('./client/styles/**/*')
        .pipe(less())
        .pipe(concatCss('app.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/css'));

    var webpack = require('webpack');
    var webpackStream = require('webpack-stream');
    return gulp.src('client/scripts/app.js')
        .pipe(webpackStream({
            devtool: 'source-map',
            plugins: [new webpack.optimize.UglifyJsPlugin({ sourceMap: true })]
        }, webpack))
        .pipe(gulp.dest('./public/js'));
});

// Inject built files in layout view
gulp.task('inject', ['build'], () => {
    var inject = require('gulp-inject');
    return gulp.src('./client/views/_layout.hbs')
        .pipe(inject(gulp.src('./public/js/*.js', { read: false }), { ignorePath: 'public' }))
        .pipe(gulp.dest('./client/views'));
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
gulp.task('default', ['inject', 'start'], () => {
    gulp.watch(['./client/scripts/**/*', './client/styles/**/*'], ['inject']);

    var openBrowser = require('gulp-open');
    gulp.src('/').pipe(openBrowser({ uri: '127.0.0.1:5000', app: 'chrome' }));
});