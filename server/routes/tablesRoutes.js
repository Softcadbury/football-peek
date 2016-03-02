'use strict';

var config = require('../config');
var express = require('express');
var router = express.Router();

router.route('/mini/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.tablesData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            // Takes the first and last three
            var data = [].concat(obj.splice(0, 3), obj.splice(-3, 3));
            res.render('tables/tableMini', { data: data });
        });
    });

router.route('/:league/:year')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var filePath = config.paths.resultsData.replace('{0}', req.params.league).replace('{1}', req.params.year);

        jsonfile.readFile(filePath, (err, obj) => {
            var teams = {};

            for (var i = 0; i < obj.length; i++) {
                var homeTeamName = obj[i].HomeTeam;
                var awayTeamName = obj[i].AwayTeam;
                var homeTeamGoals = obj[i].FTHG;
                var awayTeamGoals = obj[i].FTAG;
                var result = obj[i].FTR;

                // Home team
                if (!teams.hasOwnProperty(homeTeamName)) {
                    teams[homeTeamName] = createTeamObject();
                    teams[homeTeamName].name = homeTeamName;
                }

                var homeTeam = teams[homeTeamName];
                homeTeam.win += result === 'H' ? 1 : 0;
                homeTeam.draw += result === 'D' ? 1 : 0;
                homeTeam.lost += result === 'A' ? 1 : 0;
                homeTeam.goalsFor += homeTeamGoals;
                homeTeam.goalsAgainst += awayTeamGoals;

                // Away team
                if (!teams.hasOwnProperty(awayTeamName)) {
                    teams[awayTeamName] = createTeamObject();
                    teams[awayTeamName].name = awayTeamName;
                }

                var awayTeam = teams[awayTeamName];
                awayTeam.win += result === 'A' ? 1 : 0;
                awayTeam.draw += result === 'D' ? 1 : 0;
                awayTeam.lost += result === 'H' ? 1 : 0;
                awayTeam.goalsFor += awayTeamGoals;
                awayTeam.goalsAgainst += homeTeamGoals;
            }

            // Computes information of teams and format them in a sorted array
            var data = Object.keys(teams).map((key) => {
                var team = teams[key];
                team.score = team.win * 3 + team.draw;
                team.played = team.win + team.draw + team.lost;
                team.goalDifference = team.goalsFor - team.goalsAgainst;
                return team;
            }).sort((team1, team2) => {
                if (team2.score !== team1.score) {
                    return team2.score - team1.score;
                } else if (team2.goalDifference !== team1.goalDifference) {
                    return team2.goalDifference - team1.goalDifference;
                } else {
                    return team2.win - team1.win;
                }
            });

            data.forEach((team, index) => {
                team.position = index + 1;
            });

            res.render('tables/table', { data: data });
        });
    });

// Creates a team object
function createTeamObject() {
    return {
        position: 0,
        name: '',
        score: 0,
        played: 0,
        win: 0,
        draw: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
    };
}

module.exports = router;