const {parentPort, workerData} = require('worker_threads');

class Worker {
    progress = 0;

    constructor() {
        parentPort.on('message', (m) => {
            let cb = 'on'+m.type;
            if (typeof this[cb] == "function") {
                this[cb](m);
            }
        });
    }

    onstatus(m) {
        parentPort.postMessage({
            type: 'status',
            progress: process,
        });
    }
}

module.exports = Worker;
