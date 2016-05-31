/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        paths: {
            tableData: './data/{0}/table.json',
            scorersData: './data/{0}/scorers.json',
            assistsData: './data/{0}/assists.json',
            resultsData: './data/{0}/results.json',
            imageData: './data/{0}/images/{1}.png',
            publicImageData: './{0}/images/{1}.png'
        }
    };
}

module.exports = config();