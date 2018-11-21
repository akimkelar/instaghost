const wait = 0, inProgress = 1;
const https = require('https');

let subghost = {
    tasks: [],
    state: wait,
    currentTask: false,
    percentage: 0,

    init : function ()
    {
        process.on('message', (m) => {
            console.log('CHILD got message:', m);
            if (typeof this[m.method] == "function") {
                this[m.method](m);
            }
        });
    },

    task : function (m)
    {
        //add to stack t stack
        this.tasks.push(m.task);

        if (this.state == wait) {
            this.process();
        }
    },

    process: function ()
    {
        if (this.tasks.length > 0) {
            this.state = inProgress;
            this.currentTask = this.tasks.pop();



            this.process();
        }
        else {
            this.state = wait;
            this.currentTask = false;
        }
    },

    status : function (m)
    {
        process.send({
            type: 'status',
            status: {
                state: this.state,
                currentTask: this.currentTask,
                percentage: this.percentage,
            }
        });
    }
};

subghost.init();
