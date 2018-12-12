var express = require('express');
let Encoder = require('../../../service/Encoder');
let User = require('../../../model/User');

var router = express.Router();

router.post('/', function(req, res, next) {

    const username = req.body.user;
    const token = req.body.token;
    let valid = false;


    User.findOne({username: username}, function (err, user) {
        if (user && user.token) {
            valid = token == user.token;
        }

        res.send(JSON.stringify({
            valid: valid
        }));
    });
});

module.exports = router;
