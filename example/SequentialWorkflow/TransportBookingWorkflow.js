var Zenaton = require('../../lib/Worker');

var bookByAir = require('./BookByAir');
var bookByCar = require('./BookByCar');
var SendConfirmation = require('./SendConfirmation');


var transportBookingWorkflow = new Zenaton.Workflow({
    name: 'TransportBookingWorkflow',
    handle: function() {
        this.transport = 'car';
        if (this.transport === 'air') {
            var booking_id = execute(bookByAir({id: this.id}));
        }

        if (this.transport === 'car') {
            var booking_id = execute(bookByCar({id: this.id}));
        }

        execute(SendConfirmation({
            id: this.id,
            customer_id: this.customer_id,
            request_id: this.request_id,
            transport: this.transport,
            booking_id: booking_id
        }));
    }
});

module.exports = transportBookingWorkflow;
