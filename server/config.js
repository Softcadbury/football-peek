'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        currentYear: 2015,
        tableDataPath: './data/{0}/tables/{1}.json',
        scorerDataPath: './data/{0}/scorers/{1}.json'
    };
}

module.exports = config();