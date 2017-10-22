'use strict';

var gulp = require('gulp');

// Data harmonizer - This code can be used to modify the format of data files
gulp.task('harmonize', () => {
    var items = require('./server/data/items');
    var config = require('./server/config');
    var helper = require('./server/helper');

    items.forEach(item => {
        config.periods.availables.forEach(period => {
            if (item.isCompetition) {
                const itemDataPath = helper.stringFormat(config.paths.tournamentData, item.code, period);
                const itemData = helper.readJsonFile(itemDataPath);
                const newItemData = [];

                itemData.forEach(data => {
                    const current = {
                        name: data.name,
                        matches: []
                    };

                    data.matches.forEach(matche => {
                        current.matches.push({
                            date1: matche.date1,
                            date2: matche.date2,
                            team1: matche.team1,
                            team2: matche.team2,
                            score1: matche.score1,
                            score2: matche.score2,
                            winner: matche.winner,
                            team1Logo: matche.team1Logo,
                            team2Logo: matche.team2Logo
                        });
                    });

                    newItemData.push(current);
                });

                helper.writeJsonFile(itemDataPath, newItemData);
            }
        });
    });
});
