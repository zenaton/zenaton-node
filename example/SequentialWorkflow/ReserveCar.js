var Task = require('../../lib/Worker').Task;

var ReserveCar = new Zenaton.Task({
    name: 'ReserveCar',
    data: function() {
        return {
            booking: null,
        }
    },
    handle: function(done) {
        console.log('Reserving car for Request ID: ' + this.booking.request_id);
        setTimeout(function(){
            this.booking.car_id = '154785236';
            done(null, this.booking);
        }, Math.floor(Math.random() * 3) + 1 );

    },
});

module.exports = ReserveCar;
