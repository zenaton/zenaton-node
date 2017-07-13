var Slave = require('../lib/Worker').Slave;

require('../lib/functions');
require(process.argv[2]);


// arg 2 : source, arg3: instance_id, arg4: slave_id
(new Slave(process.argv[2], process.argv[3], process.argv[4])).process();
