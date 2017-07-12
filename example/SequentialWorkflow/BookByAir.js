var Zenaton = require('../../lib/Worker');

var bookByAir = new Zenaton.Task({
    name: 'BookByAir',
    props: ['trip'],
    handle: function(done) {
        console.log('Reserving airline for trip ID: ' + this.trip.id);
        setTimeout(function(){
            this.trip.ticket_id = '154782684269';
            done(null, this.trip.ticket_id);
        }, Math.floor(Math.random() * 3) + 1 );

    }
});

module.exports = bookByAir;
