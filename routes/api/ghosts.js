var express = require('express');
var path = require('path');
var insta = require('../../service/InstaService');

var router = express.Router();

router.get('/', function(req, res, next) {
    insta.runTask().then((m) => {
        console.log('done', m);
    });
    res.send(JSON.stringify('asd'))
});

module.exports = router;
