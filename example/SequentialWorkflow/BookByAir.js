var Zenaton = require('../../lib/Worker');

var _ = require('lodash');

var bookByAir = new Zenaton.Task({
    name: 'BookByAir',
    handle: function(done) {
        console.log('Booking airline for Request ID: ' + this.id);
        const that = this;
        setTimeout(function(){
            that.booking_id = '154782684269';
            done(null, that.booking_id);
        }, _.random(1, 3) * 1000 );

    }
});

module.exports = bookByAir;
