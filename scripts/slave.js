var Slave = require('../lib/Worker/Slave');
var boot = process.argv[2];
var slaveId = process.argv[3];
require('../lib/functions');
require(boot);


// arg3: instance_id, arg4: slave_id
(new Slave(slaveId)).process();
