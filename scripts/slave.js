var Slave = require('../lib/Worker/Slave');
var boot = process.argv[2];
var instanceId = process.argv[3];
var slaveId = process.argv[4];
require('../lib/functions');
require(boot);


// arg3: instance_id, arg4: slave_id
(new Slave(instanceId, slaveId)).process();
