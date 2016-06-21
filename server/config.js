/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        currentYear: '2015-2016',
        paths: {
            tableData: './data/{0}/{1}/table.json',
            scorersData: './data/{0}/{1}/scorers.json',
            assistsData: './data/{0}/{1}/assists.json',
            resultsData: './data/{0}/{1}/results.json',
            imageData: './data/{0}/{1}/images/{2}.png',
            publicImageData: '/{0}/{1}/images/{2}.png'
        }
    };
}

module.exports = config();