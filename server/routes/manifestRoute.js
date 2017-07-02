'use strict';

var express = require('express');
var router = express.Router();

router.route('/manifest.json')
    .get((req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            'short_name': 'Foot Peek',
            'name': 'Football Peek',
            'start_url': 'footballpeek.com',
            'display': 'standalone',
            'theme_color': '#00838f',
            'background_color': '#00838f',
            'icons': [
                {
                    'src': '/icon-192x192.png',
                    'sizes': '192x192',
                    'type': 'image/png'
                },
                {
                    'src': '/icon-512x512.png',
                    'sizes': '512x512',
                    'type': 'image/png'
                }
            ]
        }, null, 3));
    });

module.exports = router;