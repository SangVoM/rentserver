'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger        = require('morgan');
const router        = express.Router();
const router2        = express.Router();
const server = require("http").createServer(app);
const port        = process.env.PORT || 8070;
const io = require("socket.io")(server);
const fun_product = require('./functions/fun_product');
const schedule = require("node-schedule");
app.use(bodyParser.json());
app.use(logger('dev'));

require('./routes')(router);
require('./routeslol')(router2);
require('./socketio.js')(io);
app.use('/api/v1', router);
app.use('/api/v2', router2);
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});


const j = schedule.scheduleJob("50 * * * *", function () {
	fun_product.mUpView()
	// console.log("The answer to life, the universe, and everything!");
});

