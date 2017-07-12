// var bookByCar = require('./bookByCar');
// var sendConfirmation = require('./sendConfirmation');
var Zenaton = require('../../lib/Worker');
var bookByAir = require('./bookByAir');

var transportBookingWorkflow = new Zenaton.Workflow({
    name: 'TransportBookingWorkflow',
    props: ['booking'],
    handle: function() {

        if (this.booking.byAir) {
            // console.log();
            this.booking.trip.ticket_id = execute(
                bookByAir({trip: this.booking.trip})
            );
        }

        // if (this.booking.reserve_car) {
        //     this.booking = execute(ReserveCar(this.booking));
        // }

        // execute(SendConfirmation(this.booking))
    }
    // onEvent: function(event) {
    //     if (event.name === 'EngagedEvent') {
    //         this.engaged = true;
    //     }
    // },
});

module.exports = transportBookingWorkflow;
