'use strict';

var express = require('express');
var router = express.Router();

router.route('/:country/:period')
    .get((req, res) => {
        var jsonfile = require('jsonfile');
        var file = './data/' + req.params.country + '/' + req.params.period + '.json';

        jsonfile.readFile(file, (err, obj) => {
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
                homeTeam.win += result == 'H' ? 1 : 0;
                homeTeam.draw += result == 'D' ? 1 : 0;
                homeTeam.lost += result == 'A' ? 1 : 0;
                homeTeam.goalsFor += homeTeamGoals;
                homeTeam.goalsAgainst += awayTeamGoals;

                // Away team
                if (!teams.hasOwnProperty(awayTeamName)) {
                    teams[awayTeamName] = createTeamObject();
                    teams[awayTeamName].name = awayTeamName;
                }

                var awayTeam = teams[awayTeamName];
                awayTeam.win += result == 'A' ? 1 : 0;
                awayTeam.draw += result == 'D' ? 1 : 0;
                awayTeam.lost += result == 'H' ? 1 : 0;
                awayTeam.goalsFor += awayTeamGoals;
                awayTeam.goalsAgainst += homeTeamGoals;
            }

            // Computes information of teams and format them in a sorted array
            var data = Object.keys(teams).map((key) => {
                var team = teams[key];
                team.score = team.win * 3 + team.draw;
                team.goalDifference = team.goalsFor - team.goalsAgainst;
                return team;
            }).sort((team1, team2) => {
                return team2.score - team1.score;
            });

            res.render('table', { data: data });
        })
    });

// Creates a team object
function createTeamObject() {
    return {
        name: '',
        score: 0,
        win: 0,
        draw: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0
    };
}

module.exports = router;