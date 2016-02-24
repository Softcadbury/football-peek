'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        currentYear: 2015,
        tableDataUrl: 'http://www.football-data.co.uk/mmz4281/{0}/{1}.csv',
        tableDataPath: './data/{0}/table-{1}.json',
        scorerDataPath: './data/{0}/scorer-{1}.json'
    };
}

module.exports = config();