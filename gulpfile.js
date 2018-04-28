'use strict';

var gulp = require('gulp');
var config = require('./server/config');

// Updates data
// Format: gulp up -l [lague small name] -c [competition small name]
gulp.task('up', () => {
    var mainUpdater = require('./server/updaters/mainUpdater');

    config.downloadImages = true;
    config.fullResultUpdate = false;

    var argv = require('yargs').argv;
    var leagueArg = argv.l;
    var competitionArg = argv.c;

    if (leagueArg) {
        mainUpdater.updateLeague(leagueArg);
    }

    if (competitionArg) {
        mainUpdater.updateCompetition(competitionArg);
    }
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

// Data harmonizer - This code can be used to modify the format of data files
// gulp.task('harmonize', () => {
//     var items = require('./server/data/items');
//     var helper = require('./server/helper');

//     items.forEach(item => {
//         config.periods.availables.forEach(period => {
//             if (item.isCompetition) {
//                 const itemDataPath = helper.stringFormat(config.paths.tournamentData, item.code, period);
//                 const itemData = helper.readJsonFile(itemDataPath);
//                 const newItemData = [];

//                 itemData.forEach(data => {
//                     const current = {
//                         name: data.name,
//                         matches: []
//                     };

//                     data.matches.forEach(matche => {
//                         current.matches.push({
//                             date1: matche.date1,
//                             date2: matche.date2,
//                             team1: matche.team1,
//                             team2: matche.team2,
//                             score1: matche.score1,
//                             score2: matche.score2,
//                             winner: matche.winner,
//                             team1Logo: matche.team1Logo,
//                             team2Logo: matche.team2Logo
//                         });
//                     });

//                     newItemData.push(current);
//                 });

//                 helper.writeJsonFile(itemDataPath, newItemData);
//             }
//         });
//     });
// });