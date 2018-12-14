const config = require("../../config");
var express = require('express');
let Encoder = require('../../service/Encoder');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.header('Content-type', 'application/json');
    res.send(JSON.stringify({
        api: {
            authKey: Encoder.getKey(),
            clientId: config.clientId,
        }
    }));
});

module.exports = router;
