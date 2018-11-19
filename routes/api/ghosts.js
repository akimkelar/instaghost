var express = require('express');
var path = require('path');
var ghost = require('../../process/ghost');
//const {Worker} = require('worker_threads');

var router = express.Router();

router.get('/', function(req, res, next) {
    //var workerFile = path.join(path.dirname(require.main.filename), '../worker/ghost.js');
    //let worker = new Worker(workerFile, {workerData: {nickname: 'akimkelar'}});

    /*worker.on('message', (m) => {
        console.log('Got message from worker: ', m);
        if (m.status == 'run') {
            m.data.percent = 10;
            res.send(JSON.stringify(m));
        }
    });*/

    ghost.runTask().then(() => {

    });
    res.send(JSON.stringify('asd'))
});

module.exports = router;