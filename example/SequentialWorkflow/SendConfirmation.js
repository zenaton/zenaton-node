var Zenaton = require('../../lib/Worker');

var SendConfirmation = new Zenaton.Task({
    name: 'SendConfirmation',
    handle: function(done) {
        console.log('Sending notification to customer ');
        console.log('Customer ID: ' + this.customer_id);
        console.log('Request ID: ' + this.id);

        if (this.transport === 'air') {
            console.log('Ticket ID: ' + this.booking_id);
        }

        if (this.transport === 'car') {
            console.log('Car ID: ' + this.booking_id);
        }

        done();
    }
});

module.exports = SendConfirmation;
