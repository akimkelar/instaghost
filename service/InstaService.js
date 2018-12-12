const {Worker} = require('worker_threads');

let InstaService = {
    workers: [],
    lastId: null,

    signin: function (username, password) {
        return new Promise((resolve, reject) => {
            resolve(); return;
            console.log('IS: starting worker');

            const worker = new Worker('./worker/signin.js', {workerData: {username: username, password: password}});

            worker.on('message', (m) => {
                console.log('IS message', m);
                if (m.type == 'result') {
                    resolve(m);
                }
            });

            worker.on('error', reject);

            worker.on('exit', (code) => {
                this.workers.splice(worker.threadId, 1);
                if (code !== 0)
                    reject(new Error(`Worker signin stopped with exit code ${code}`));
            });

            this.workers[worker.threadId] = worker;
            this.lastId = worker.threadId;
        });
    },

    runTask: function ()
    {
        return new Promise((resolve, reject) => {
            //todo username from User model
            const worker = new Worker('./worker/ghost.js', {workerData: {username: 'akimkelar'}});

            worker.on('message', (m) => {
                if (m.type == 'result') {
                    resolve(m);
                }
            });

            worker.on('error', reject);

            worker.on('exit', (code) => {
                this.workers.splice(worker.threadId, 1);
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });

            this.workers[worker.threadId] = worker;
            this.lastId = worker.threadId;
        });
    },

    getStatus: function (id)
    {
        return new Promise(((resolve, reject) => {
            if (typeof this.workers[id] != "undefined") {
                try {
                    this.workers[id].postMessage({type: 'status'});
                    this.workers[id].on('message', (m) => {
                        if (m.type == 'status') {
                            resolve(m);
                        }
                    });
                } catch (e) {
                    reject(e);
                }
            }
            else {
                reject('Worker unavailable');
            }
        }));
    }
};

module.exports = InstaService;
