var fs = require('fs');
var Slave = require('../lib/Worker').Slave;
var Zenaton = require('../lib/Worker');

require('../lib/functions');

require(process.argv[2]);

// function shutdown()
// {
//     $ms = MicroServer::getInstance();
//
//     $last = error_get_last();
//     $str = '"'.$last['message'].'" on line '. $last['line']. ' in file "'. $last['file'].'"';
//     if ($ms->isWorking()) {
//         $e = new ExternalZenatonException($str);
//         $ms->failWorker($e);
//     }
//
//     if ($ms->isDeciding()) {
//         $e = new ExternalZenatonException($str);
//         $ms->failDecider($e);
//     }
// }
//
// register_shutdown_function('shutdown');

// arg 2 : source, arg3: instance_id, arg4: slave_id
(new Slave(process.argv[2], process.argv[3], process.argv[4])).process();
