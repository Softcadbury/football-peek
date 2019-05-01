'use strict';

var gulp = require('gulp');

// Updates all data
gulp.task('up', async () => {
    var config = require('./server/config');
    var leagues = require('./server/data/leagues');
    var competitions = require('./server/data/competitions');
    var mainUpdater = require('./server/updaters/mainUpdater');

    config.downloadImages = true;
    config.fullResultUpdate = true;

    await mainUpdater.updateLeague(leagues.bundesliga);
    await mainUpdater.updateLeague(leagues.premierLeague);
    await mainUpdater.updateLeague(leagues.ligue1);
    await mainUpdater.updateLeague(leagues.serieA);
    await mainUpdater.updateLeague(leagues.liga);
    await mainUpdater.updateCompetition(competitions.championsLeague);
    await mainUpdater.updateCompetition(competitions.europaLeague);
});

// Check coding rules
gulp.task('lint', () => {
    var eslint = require('gulp-eslint');
    return gulp
        .src(['**/*.js', '!node_modules/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Run tests
gulp.task('test', () => {
    var mocha = require('gulp-mocha');
    gulp
        .src('./tests/*.js', {
            read: false
        })
        .pipe(
            mocha({
                reporter: 'nyan'
            })
        );
});

// Build the sprite
gulp.task('sprite', () => {
    var spritesmith = require('gulp.spritesmith');
    var spritesmithOptions = spritesmith({
        cssName: 'client/styles/misc/sprite.css',
        imgName: 'client/images/sprite.png',
        imgPath: '../../images/sprite.png'
    });

    gulp
        .src(['data/images/**/*.gif', 'data/images/**/*.png'])
        .pipe(spritesmithOptions)
        .pipe(gulp.dest('.'));
});

// Optimize images
gulp.task('optim', () => {
    var imagemin = require('gulp-imagemin');

    gulp
        .src('client/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('client/images'));
});

// Build the application in the dist folder
gulp.task('build', () => {
    var webpack = require('webpack');
    var webpackStream = require('webpack-stream');
    var CleanWebpackPlugin = require('clean-webpack-plugin');
    var ExtractTextPlugin = require('extract-text-webpack-plugin');
    var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

    var extractLess = new ExtractTextPlugin('style.bundle.[hash].css');

    var webpackModule = {
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

    var webpackPlugins = [
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
});

// Inject built files in layout view
gulp.task('inject', ['build'], () => {
    var inject = require('gulp-inject');
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
});

// Start the node server
gulp.task('start', () => {
    var nodemon = require('gulp-nodemon');
    var options = {
        script: 'server.js',
        delayTime: 1,
        env: {
            PORT: config.port
        },
        watch: ['./server']
    };

    return nodemon(options);
});

// Manage build, start the node server and open the browser
gulp.task('default', ['inject', 'start'], () => {
    gulp.watch(['./client/scripts/**/*', './client/styles/**/*'], ['inject']);

    var openBrowser = require('gulp-open');
    gulp.src('/').pipe(
        openBrowser({
            uri: '127.0.0.1:' + config.port,
            app: 'chrome'
        })
    );
});