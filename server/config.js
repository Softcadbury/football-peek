/* global process */
'use strict';

function config() {
    return {
        port: process.env.PORT || 5000,
        downloadImages: false,
        paths: {
            tableData: './data/{0}/{1}/table.json',
            scorersData: './data/{0}/{1}/scorers.json',
            assistsData: './data/{0}/{1}/assists.json',
            resultsData: './data/{0}/{1}/results.json',
            tournamentData: './data/{0}/{1}/tournament.json',
            groupsData: './data/{0}/{1}/groups.json',
            logosData: './data/images/logos/{0}.gif',
            flagsData: './data/images/flags/{0}.gif'
        },
        years: {
            current: '2017-2018',
            availables: [
                '2017-2018',
                '2016-2017',
                '2015-2016',
                '2014-2015',
                '2013-2014',
                '2012-2013',
                '2011-2012',
                '2010-2011',
                '2009-2010',
                '2008-2009',
                '2007-2008']
        }
    };
}

module.exports = config();