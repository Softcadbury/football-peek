'use strict';

var gulp = require('gulp');
var config = require('./server/config');

// Updates data
// Format: gulp up -l [lague small name] -c [competition small name]
gulp.task('up', () => {
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
    return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Run tests
gulp.task('test', () => {
    var mocha = require('gulp-mocha');
    gulp.src('./tests/*.js', {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

// Build the sprite
gulp.task('sprite', () => {
    var spritesmith = require('gulp.spritesmith');
    var spritesmithOptions = spritesmith({
        cssName: 'client/styles/miscs/sprite.css',
        imgName: 'client/images/sprite.png',
        imgPath: '../../images/sprite.png'
    });

    gulp.src(['data/images/**/*.gif', 'data/images/**/*.png'])
        .pipe(spritesmithOptions)
        .pipe(gulp.dest('.'));
});

// Optimize images
gulp.task('optim', () => {
    var imagemin = require('gulp-imagemin');

    gulp.src('client/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('client/images'));
});

// Clean built files
gulp.task('clean', (cb) => {
    var rimraf = require('rimraf');
    rimraf('./dist/', cb);
});

// Build the application in the dist folder
gulp.task('build', ['clean'], () => {
    var webpack = require('webpack');
    var webpackStream = require('webpack-stream');
    var ExtractTextPlugin = require('extract-text-webpack-plugin');

    return gulp.src(['client/scripts/app.js', 'client/styles/app.less'])
        .pipe(webpackStream({
            devtool: 'source-map',
            module: {
                rules: [{
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
                }, {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract(['style-loader', 'css-loader'])
                }, {
                    test: /\.(jpg|png|eot|woff2|ttf|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]'
                        }
                    }
                }]
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: true
                }),
                new webpack.LoaderOptionsPlugin({
                    minimize: true
                }),
                new ExtractTextPlugin('style.bundle.[hash].css')
            ],
            output: {
                filename: 'script.bundle.[hash].js'
            }
        }, webpack))
        .pipe(gulp.dest('./dist'));
});

// Inject built files in layout view
gulp.task('inject', ['build'], () => {
    var inject = require('gulp-inject');
    inject.transform.html.js = filepath => `<script src="${filepath}" async></script>`;

    return gulp.src('./client/views/commons/_layout.ejs')
        .pipe(inject(gulp.src(['./dist/*.js', './dist/*.css'], {
            read: false
        }), {
            ignorePath: 'dist'
        }))
        .pipe(gulp.dest('./client/views'));
});

// Start the node server
gulp.task('start', () => {
    var nodemon = require('gulp-nodemon');
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            'PORT': config.port
        },
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
    gulp.src('/').pipe(openBrowser({
        uri: '127.0.0.1:' + config.port,
        app: 'chrome'
    }));
});