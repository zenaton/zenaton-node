var Slave = require('../lib/Worker/Slave');
var boot = process.argv[2];
var workerId = process.argv[3];
require('../lib/functions');
require(boot);

(new Slave(workerId)).process();
