var express = require('express');
var path = require('path');
var ghost = require('../../service/ghost');

var router = express.Router();

router.get('/', function(req, res, next) {
    ghost.runTask().then((m) => {
        console.log('done', m);
    });
    res.send(JSON.stringify('asd'))
});

module.exports = router;