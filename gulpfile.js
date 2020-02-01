'use strict';

const gulp = require('gulp');

// Updates all data
exports.up = async () => {
    const config = require('./server/config');
    const leagues = require('./server/data/leagues');
    const competitions = require('./server/data/competitions');
    const mainUpdater = require('./server/updaters/mainUpdater');

    config.downloadImages = true;
    config.fullResultUpdate = false;

    await mainUpdater.updateLeague(leagues.bundesliga);
    await mainUpdater.updateLeague(leagues.premierLeague);
    await mainUpdater.updateLeague(leagues.ligue1);
    await mainUpdater.updateLeague(leagues.serieA);
    await mainUpdater.updateLeague(leagues.liga);
    await mainUpdater.updateCompetition(competitions.championsLeague);
    await mainUpdater.updateCompetition(competitions.europaLeague);
};

// Check coding rules
exports.lint = () => {
    const eslint = require('gulp-eslint');

    return gulp
        .src(['**/*.js', '!node_modules/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

// Run tests
exports.test = () => {
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
};

// Build the sprite
exports.sprite = () => {
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
};

// Optimize images
exports.optim = () => {
    const imagemin = require('gulp-imagemin');

    return gulp
        .src('client/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('client/images'));
};

// Build the application in the dist folder
exports.build = function build() {
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
};

// Inject built files in layout view
exports.inject = function inject() {
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
};

exports.watch = function watch() {
    gulp.watch(['./client/scripts/**/*', './client/styles/**/*'], gulp.series(exports.build, exports.inject));
};

// Start the node server
exports.node = function node() {
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
};

exports.start = gulp.series(exports.build, exports.inject, gulp.parallel(exports.watch, exports.node));