'use strict';

var express = require('express');
var router = express.Router();

router.route('/manifest.json')
    .get((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            'short_name': 'DashFoot',
            'name': 'Football Peek',
            'start_url': 'footballpeek.com',
            'display': 'standalone',
            'theme_color': '#004365',
            'background_color': '#004365',
            'icons': [
                {
                    'src': '/icon-48x48.png',
                    'type': 'image/png',
                    'sizes': '48x48'
                },
                {
                    'src': '/icon-128x128.png',
                    'type': 'image/png',
                    'sizes': '128x128'
                },
                {
                    'src': '/icon-512x512.png',
                    'type': 'image/png',
                    'sizes': '512x512'
                }
            ]
        }, null, 3));
    });

module.exports = router;