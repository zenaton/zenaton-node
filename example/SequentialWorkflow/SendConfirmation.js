var Task = require('../../lib/Worker').Task;

var SendConfirmation = new Zenaton.Task({
    name: 'SendConfirmation',
    data: function() {
        return {
            booking: null,
        }
    },
    handle: function(done) {
        console.log('Sending notification to customer ');

        if (this.booking.reserve_air) {
            console.log('Ticket ID: ' + this.booking.ticket_id);
        }

        if (this.booking.reserve_car) {
            console.log('Car ID: ' + this.booking.car_id);
        }
    }
});

module.exports = SendConfirmation;
