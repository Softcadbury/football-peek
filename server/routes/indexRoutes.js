'use strict';

var express = require('express');
var router = express.Router();

router.route('')
    .get(function (req, res) {
        var jsonfile = require('jsonfile');
        var file = './data/England/2014-2015.json';
        var sortedTeams;

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

            // Add score to teams and format them in an array
            var formatedTeams = [];
            for (var team in teams) {
                teams[team].score = teams[team].win * 3 + teams[team].draw;
                teams[team].goalDifference = teams[team].goalsFor - teams[team].goalsAgainst;
                formatedTeams.push(teams[team]);
            }

            sortedTeams = formatedTeams.sort((t1, t2) => {
                return t2.score - t1.score;
            });

            res.render('index', { data: sortedTeams });
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