const {parentPort, workerData} = require('worker_threads');
const needle = require('needle');

let ghostWorker = {
    percentage: 0,

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
        //login
        /*let cookies, rollout_hash, csrf_token;
        await needle('get', "https://www.instagram.com/accounts/login/?source=auth_switcher")
            .then(function(resp) {
                cookies = resp.cookies;
                //get ,"rollout_hash":"a6abd1200036",
                rollout_hash = resp.body.match(/rollout_hash":"(\w+)"/)[1];
                // {"csrf_token":"9mBa1KSUD0L8owJBLX3YYoZZ9di21WM8",
                csrf_token = resp.body.match(/csrf_token":"(\w+)"/)[1];
            });


        needle.post(
            "https://www.instagram.com/accounts/login/ajax/",
            {
                username: "akimkelar",
                password: "***",
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
                console.log(resp);
                /!*needle('get', "https://www.instagram.com/").then(function(resp) {
                    console.log(resp.body);
                });*!/
            }
        );*/

        // for followers get utl like
        // https://www.instagram.com/graphql/query/?query_hash=56066f031e6239f35a904ac20c9f37d9&variables=%7B%22id%22%3A%22907798820%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Atrue%2C%22first%22%3A24%7D
        // find key in script like
        // https://www.instagram.com/static/bundles/base/Consumer.js/c7548aaadfb8.js
        // key stores in u variable in part of code like
        // var r=n(531),o=n(792),i=n(4),a=n.n(i),c=n(98),u="56066f031e6239f35a904ac20c9f37d9",l="c56ee0ae1f89cdbd1c89e2bc6b8f3d18",s=1;function f(e){var t,n="edge_follow";switch(e){case"inbound":t=u,n="edge_followed_by";break;case"outbound":t=l,n="edge_follow";break;
        // for follows the same, except that key is in "l" variable
        // pagination like
        // https://www.instagram.com/graphql/query/?query_hash=56066f031e6239f35a904ac20c9f37d9&variables=%7B%22id%22%3A%22907798820%22%2C%22include_reel%22%3Atrue%2C%22fetch_mutual%22%3Afalse%2C%22first%22%3A12%2C%22after%22%3A%22QVFEQnhwdV9HNUQyWmVFYnZ6a2UtWGNCdHYwZGJDY1Y3ZWJQeEh0UDFwSWlwRnhObFBPSFZla1ZKNVRJMFJZSVZTVzN0TWJXeDlVQ0IxMTM4a0pQSE8zbg%3D%3D%22%7D
        // after is end_cursor from previous response
    },

    onstatus: (m) => {

    }
};

ghostWorker.init();