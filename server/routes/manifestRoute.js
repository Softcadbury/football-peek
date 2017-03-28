'use strict';

var express = require('express');
var router = express.Router();

router.route('/manifest.json')
    .get((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            'short_name': 'Football',
            'name': 'Dashboard Football',
            'start_url': 'dashboardfootball.com',
            'display': 'standalone',
            'icons': [
                {
                    'src': '/trophy-logo-48x48.png',
                    'type': 'image/png',
                    'sizes': '48x48'
                },
                {
                    'src': '/trophy-logo-128x128.png',
                    'type': 'image/png',
                    'sizes': '128x128'
                },
                {
                    'src': '/trophy-logo-200x200.png',
                    'type': 'image/png',
                    'sizes': '200x200'
                }
            ]
        }, null, 3));
    });

module.exports = router;