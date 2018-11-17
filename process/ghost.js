const {Worker} = require('worker_threads');

let ghost = {
    process: null,

    start: function()
    {
        this.stop();
        this.process = require('child_process').fork(`${__dirname}/subghost.js`);

        this.process.on('exit', () => this.start());
        this.process.on('close', () => this.start());
        this.process.on('disconnect', () => this.start());
        this.process.on('error', (err) => console.error(err));
    },

    stop: function() {
        if (this.process) {
            this.process.kill();
        }
    },

    onmessage : function(m)
    {
        return new Promise((resolve, reject) => {
            this.process.on('message', (m) => {
                console.log('PARENT got message:', m);
                cb = 'on'+m.type;
                if (typeof this[cb] == "function") {
                    this[cb](m);
                }
            });
        });
    },

    runTask: function ()
    {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker/ghost.js', {workerData: 'akimkelar'});
            worker.on('message', (m) => {
                if (m.type == 'result') {
                    resolve(m);
                }
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });

        });
    },

    getStatus: function ()
    {
        this.process.send({method: 'status'});
        return new Promise((resolve, reject) => {
            this.process.on('message', (m) => {
                try {
                    this.callback(m);
                }
                catch (e) {
                    reject(e);
                }
                resolve();
            });
        });
    },

    onstatus: function (m)
    {

    }
};

module.exports = ghost;