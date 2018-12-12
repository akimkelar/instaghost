var express = require('express');
let Encoder = require('../../../service/Encoder');
let User = require('../../../model/User');
let insta = require('../../../service/InstaService');

var router = express.Router();

router.post('/', function(req, res, next) {

    const username = req.body.username;
    const password = req.body.password;

    console.log('Token: u,p: ', username, password);

    //check username and password
    insta.signin(username, password).then(function (result) {
        console.log('Token: result: ', result);

        User.findOne({username: username}, function (err, user) {
            if (!user) {
                //create and save
            }
        });

        res.send(JSON.stringify({
            session_id: 'asd',
            error: false,
        }));
    });
});

module.exports = router;
