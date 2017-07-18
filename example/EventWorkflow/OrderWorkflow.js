var Zenaton = require('../../lib/Worker');

var prepareOrder = require('./PrepareOrder');
var sendOrder = require('./SendOrder');
var cancelOrder = require('./CancelOrder');

var orderWorkflow = new Zenaton.Workflow({
    name: 'OrderWorkflow',
    handle: function() {


        execute(prepareOrder({item: this.item}));

        if (!this.cancelled) {
            const id = execute(sendOrder({item: this.item, address: this.address}));
        }
    },
    onEvent: function(event) {

        if (event.name === 'OrderCanceledEvent') {
            this.cancelled = true;
            execute(cancelOrder({item: this.item}));
        }

        if (event.name === 'DeliveryAddressUpdatedEvent') {
            this.address = event.address;
        }
    }
});

module.exports = orderWorkflow;
