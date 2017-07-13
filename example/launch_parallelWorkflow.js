
var client = require('./client');
var transportBookingWorkflow = require('./SequentialWorkflow/TransportBookingWorkflow');

var request = {
    id: '1234567890',
    customer_id: '2DER45G',
    transport: 'air'
};

 var instance = client.start(transportBookingWorkflow(request));
 console.log('launched! ' + instance.getId());
// transportBookingWorkflow(request).handle()
