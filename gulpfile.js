'use strict';

const gulp = require('gulp');

// Update data
async function up() {
    const config = require('./server/config');
    const leagues = require('./server/data/leagues');
    const competitions = require('./server/data/competitions');
    const mainUpdater = require('./server/updaters/mainUpdater');

    config.updateCompetitionGroups = true;
    config.updateCompetitionTournaments = true;
    config.updateWithImagesDownload = true;
    config.updateWithFullResults = true;

    await mainUpdater.updateLeague(leagues.bundesliga);
    await mainUpdater.updateLeague(leagues.premierLeague);
    await mainUpdater.updateLeague(leagues.ligue1);
    await mainUpdater.updateLeague(leagues.serieA);
    await mainUpdater.updateLeague(leagues.liga);
    await mainUpdater.updateCompetition(competitions.championsLeague);
    await mainUpdater.updateCompetition(competitions.europaLeague);
}

// Check coding rules
function lint() {
    const eslint = require('gulp-eslint');

    return gulp
        .src(['**/*.js', '!node_modules/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// Run tests
function test() {
    const mocha = require('gulp-mocha');

    return gulp
        .src('./tests/*.js', {
            read: false
        })
        .pipe(
            mocha({
                reporter: 'nyan'
            })
        );
}

// Build the sprite
function sprite() {
    const spritesmith = require('gulp.spritesmith');
    const spritesmithOptions = spritesmith({
        cssName: 'client/styles/misc/sprite.css',
        imgName: 'client/images/sprite.png',
        imgPath: '../../images/sprite.png'
    });

    return gulp
        .src(['data/images/**/*.gif', 'data/images/**/*.png'])
        .pipe(spritesmithOptions)
        .pipe(gulp.dest('.'));
}

// Optimize images
function optim() {
    const imagemin = require('gulp-imagemin');

    return gulp
        .src('client/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('client/images'));
}

// Build the application in the dist folder
function build() {
    const webpack = require('webpack');
    const webpackStream = require('webpack-stream');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

    const extractLess = new ExtractTextPlugin('style.bundle.[hash].css');

    const webpackModule = {
        rules: [
            {
                test: /\.less$/,
                use: extractLess.extract(['css-loader', 'less-loader'])
            },
            {
                test: /\.css$/,
                use: extractLess.extract(['style-loader', 'css-loader'])
            },
            {
                test: /\.(jpg|png|eot|woff2|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]'
                    }
                }
            }
        ]
    };

    const webpackPlugins = [
        new CleanWebpackPlugin(['dist']),
        new UglifyJsPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        extractLess
    ];

    return gulp
        .src(['client/scripts/app.js', 'client/styles/app.less'])
        .pipe(
            webpackStream(
                {
                    mode: 'production',
                    module: webpackModule,
                    plugins: webpackPlugins,
                    output: {
                        filename: 'script.bundle.[hash].js'
                    },
                    performance: {
                        hints: false
                    }
                },
                webpack
            )
        )
        .pipe(gulp.dest('./dist'));
}

// Inject built files in layout view
function inject() {
    const inject = require('gulp-inject');
    inject.transform.html.js = filepath => `<script src="${filepath}" async></script>`;

    return gulp
        .src('./client/views/commons/_layout.ejs')
        .pipe(
            inject(
                gulp.src(['./dist/*.js', './dist/*.css'], {
                    read: false
                }),
                {
                    ignorePath: 'dist'
                }
            )
        )
        .pipe(gulp.dest('./client/views/commons'));
}

// Watch client files modification
function watch() {
    gulp.watch(['./client/scripts/**/*', './client/styles/**/*'], gulp.series(build, inject));
}

// Start the node server
function node() {
    const config = require('./server/config');
    const nodemon = require('gulp-nodemon');

    const options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            PORT: config.port
        },
        watch: ['./server']
    };

    return nodemon(options);
}

exports.up = up;
exports.lint = lint;
exports.test = test;
exports.images = gulp.series(sprite, optim);
exports.start = gulp.series(build, inject, gulp.parallel(watch, node));