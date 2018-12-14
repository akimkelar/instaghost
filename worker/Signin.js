const {parentPort, workerData} = require('worker_threads');
const needle = require('needle');
const Worker = require('./Worker');
const config = require('../config');
const Instagram = require('node-instagram').default;

let Signin = Object.assign(Worker, {
    process: async function () {

        const instagram = new Instagram({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            accessToken: config.accessToken,
        });

        instagram.get('users/self', (err, data) => {
            if (err) {
                // an error occured
                console.log(err);
            } else {
                console.log(data);
            }
        });

        return;

        let cookies, rollout_hash, csrf_token, body;
        // await needle('get', "https://www.instagram.com/");

        //check login
        await needle('get', "https://www.instagram.com/accounts/login/?source=auth_switcher")
            .then(function(resp) {
                cookies = resp.cookies;
                console.log(resp.cookies);
                //get ,"rollout_hash":"a6abd1200036",
                rollout_hash = resp.body.match(/rollout_hash":"(\w+)"/)[1];
                // {"csrf_token":"9mBa1KSUD0L8owJBLX3YYoZZ9di21WM8",
                csrf_token = resp.body.match(/csrf_token":"(\w+)"/)[1];
            });
        this.setProgress(30);

        // login
        // on wrong user ajax responds
        // {"authenticated": false, "user": true, "status": "ok"}
        await needle.post(
            "https://www.instagram.com/accounts/login/ajax/",
            {
                username: workerData.username,
                password: workerData.password,
                queryParams: {"source":"auth_switcher"}
            },
            {
                multipart: true,
                cookies: cookies,
                headers: {
                    "x-csrftoken": csrf_token,
                    "x-instagram-ajax": rollout_hash,
                    "x-requested-with": "XMLHttpRequest"
                }
            },
            function (err, resp) {
                cookies = {...cookies, ...resp.cookies};
                body = resp.body;
            }
        );
        this.setProgress(60);

        this.complete({
            cookies: cookies,
            rollout_hash: rollout_hash,
            csrf_token: csrf_token,
            body: body,
        });
    }
});

Signin.init();
Signin.process();
