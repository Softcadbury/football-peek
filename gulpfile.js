'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var updater = require('./server/utils/updater');

// Updates data of current year
gulp.task('update', () => {
    updater.updateCurrent();
});

// Updates data of old years
gulp.task('updateall', ['update'], () => {
    updater.updateAll();
});

// Start the node server
gulp.task('start', function () {
    var options = {
        script: 'server/app.js',
        delayTime: 1,
        env: {
            'PORT': 5000
        },
        watch: ['./*.js', './server/*.js']
    };

    return nodemon(options).on('restart', function () {
        console.log('Restarting...');
    });
});