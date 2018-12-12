const {parentPort, workerData} = require('worker_threads');
const needle = require('needle');
const User = require('../model/User');

let ghostWorker = {
    progress: 0,

    init: function () {
       parentPort.on('message', (m) => {
           cb = 'on'+m.type;
           if (typeof this[cb] == "function") {
               this[cb](m);
           }
       });

       this.process();
    },

    process: async function () {
        let cookies, rollout_hash, csrf_token;

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

        // login
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
            }
        );

        parentPort.postMessage({
            type: 'result',
            cookies: cookies,
            rollout_hash: rollout_hash,
            csrf_token: csrf_token
        });
    },

    onstatus: (m) => {

    }
};

ghostWorker.init();
