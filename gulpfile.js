'use strict';

var gulp = require('gulp');
var config = require('./server/config');
var leagues = require('./server/data/leagues');
var competitions = require('./server/data/competitions');

// Updates all data
gulp.task('upall', async () => {
    var mainUpdater = require('./server/updaters/mainUpdater');

    config.downloadImages = true;
    config.fullResultUpdate = true;

    await mainUpdater.updateLeague(leagues.bundesliga.smallName);
    await mainUpdater.updateLeague(leagues.premierLeague.smallName);
    await mainUpdater.updateLeague(leagues.ligue1.smallName);
    await mainUpdater.updateLeague(leagues.serieA.smallName);
    await mainUpdater.updateLeague(leagues.liga.smallName);
    await mainUpdater.updateCompetition(competitions.championsLeague.smallName);
    await mainUpdater.updateCompetition(competitions.europaLeague.smallName);
});

// Updates data
// Format: gulp up -l [lague small name] -c [competition small name]
gulp.task('up', async () => {
    var mainUpdater = require('./server/updaters/mainUpdater');

    config.downloadImages = true;
    config.fullResultUpdate = false;

    var argv = require('yargs').argv;
    var leagueArg = argv.l;
    var competitionArg = argv.c;

    if (leagueArg) {
        leagueArg = typeof leagueArg === 'string' ? leagueArg.toUpperCase() : null;
        if (!leagueArg || Object.values(leagues).some(p => p.smallName === leagueArg)) {
            await mainUpdater.updateLeague(leagueArg);
        } else {
            console.log(leagueArg + ' not found. Options are -l [DEU|ESP|ITA|FRA|ENG]');
        }
    }

    if (competitionArg) {
        competitionArg = typeof competitionArg === 'string' ? competitionArg.toUpperCase() : null;
        if (!competitionArg || Object.values(competitions).some(p => p.smallName === competitionArg)) {
            await mainUpdater.updateCompetition(competitionArg);
        } else {
            console.log(competitionArg + ' not found. Options are -c [C1|C3]');
        }
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