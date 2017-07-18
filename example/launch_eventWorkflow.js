
var client = require('./client');
var orderWorkflow = require('./EventWorkflow/OrderWorkflow');
var deliveryAddressUpdatedEvent = require('./EventWorkflow/DeliveryAddressUpdatedEvent');
var orderCanceledEvent = require('./EventWorkflow/OrderCanceledEvent');

var data = {
    item: 'shirt',
    address: '1600 Pennsylvania Ave NW, Washington, DC 20500, USA',
    cancelled: false
};

 var instance = client.start(orderWorkflow(data));
 console.log('launched! ' + instance.getId());


 setTimeout(function(){
    //  instance.sendEvent(deliveryAddressUpdatedEvent({address: 'One Infinite Loop Cupertino, CA 95014'}));

     instance.sendEvent(orderCanceledEvent());
     console.log("event sent!");
 }, 2 * 1000 );
