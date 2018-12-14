const {parentPort, workerData} = require('worker_threads');

let Worker = {
    STATUS_WORKING: 'working',
    STATUS_COMPLETE: 'complete',

    status: this.STATUS_WORKING,
    progress: 0,

    init: function () {
        parentPort.on('message', (m) => {
            let cb = 'on'+m.type;
            if (typeof this[cb] == "function") {
                this[cb](m);
            }
        });
    },

    complete: function (m) {
        parentPort.postMessage(Object.assign(m,{type: 'result'}));
        this.status = this.STATUS_COMPLETE;
        this.setProgress(100);
    },

    setProgress: function (num) {
        num = parseInt(num);
        if (isNaN(num)) {
            throw "setProgress not a number given";
        }
        if (num < 0 || num > 100) {
            throw "setProgress wrong number"
        }
        this.progress = num;
    },

    onstatus: function (m) {
        parentPort.postMessage({
            type: 'status',
            status: this.status,
            progress: process,
        });
    }
};

module.exports = Worker;
