
var client = require('./client');
var parallelWorkflow = require('./ParallelWorkflow/ParallelWorkflow');

var item = {
    item: 'shirt'
};

 var instance = client.start(parallelWorkflow(item));
 console.log('launched! ' + instance.getId());
