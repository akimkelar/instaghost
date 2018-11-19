const {parentPort, workerData} = require('worker_threads');
const https = require('https');

let ghostWorker = {
    percentage: 0,

    init: () => {
       parentPort.on('message', (m) => {
           cb = 'on'+m.type;
           if (typeof this[cb] == "function") {
               this[cb](m);
           }
       });

       this.process();
    },

    process: () => {
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

        //get profile page
        https.get('https://www.instagram.com/'+workerData.nickname+'/', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                //data
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    },

    onstatus: (m) => {

    }
};

ghostWorker.init();