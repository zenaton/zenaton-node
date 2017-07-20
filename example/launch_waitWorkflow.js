
var client = require('./client');
var waitWorkflow = require('./WaitWorkflow/WaitWorkflow');
var orderCanceledEvent = require('./EventWorkflow/OrderCanceledEvent');

var request = {
    id: '1234567890',
    customer_id: '2DER45G',
    transport: 'air'
};

 var instance = client.start(waitWorkflow(request));
 console.log('launched! ' + instance.getId());
// transportBookingWorkflow(request).handle()
