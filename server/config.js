/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        paths: {
            tableData: './data/{0}/{1}/table.json',
            scorersData: './data/{0}/{1}/scorers.json',
            assistsData: './data/{0}/{1}/assists.json',
            resultsData: './data/{0}/{1}/results.json',
            logosData: './data/images/logos/{0}.png',
            flagsData: './data/images/flags/{0}.png'
        },
        years: {
            current: '2015-2016',
            availables: ['2015-2016', '2014-2015', '2013-2014', '2012-2013', '2011-2012', '2010-2011']
        }
    };
}

module.exports = config();