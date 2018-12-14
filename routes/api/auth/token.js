const config = require('../../../config');
const Instagram = require('node-instagram').default;
var express = require('express');
let User = require('../../../model/User');

var router = express.Router();
let memorization = {};

router.post('/', async function(req, res, next) {
    const access_token = req.body.access_token;
    let valid = false;

    if (typeof memorization[access_token] == "undefined") {

        const instagram = new Instagram({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            accessToken: access_token,
        });

        await instagram.get('users/self', (err, data) => {
            if (!err) {
                valid = true;

                // check User model to save new user
                User.findOne({username: data.data.username}, function (err, user) {
                    if (!user) {
                        user = new User({
                            _id: data.data.id,
                            username: data.data.username,
                            profile_picture: data.data.profile_picture,
                            full_name: data.data.full_name,
                            counts: data.data.counts,
                        });

                        user.save(function (err) {
                            if (err) return handleError(err);
                        });
                    }
                });
            }
        });

        memorization[access_token] = valid;
    }
    else {
        valid = memorization[access_token];
    }

    res.send(JSON.stringify({
        valid: valid
    }));
});

module.exports = router;
