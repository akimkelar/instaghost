const {Worker} = require('worker_threads');

class Ghost {

}

let ghost = {
    workers: [],
    lastId: null,

    runTask: function ()
    {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker/ghost.js', {workerData: {nickname: 'akimkelar'}});

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

module.exports = ghost;