var HandleParameters = require('../lib/Worker/HandleParameters');
var classes = process.argv[2];
var boot = process.argv[3];
require(boot);
const response = (new HandleParameters()).process(classes);
console.log(JSON.stringify(response));
