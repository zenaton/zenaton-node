var Zenaton = require('../../lib/Worker');

var bookByAir = new Zenaton.Task({
    name: 'BookByAir',
    handle: function(done) {
        console.log('Booking airline for Request ID: ' + this.id);
        const that = this;
        setTimeout(function(){
            that.booking_id = '154782684269';
            done(null, that.booking_id);
        }, Math.floor(Math.random() * 3) + 1 );

    }
});

module.exports = bookByAir;
