var Zenaton = require('../../lib/Worker');

var _ = require('lodash');

var cancelOrder = new Zenaton.Task({
    name: 'CancelOrder',
    handle: function(done) {
        console.log('Canceling order for item: ' + this.item);

        setTimeout(function(){
            console.log('Order canceled');
            done();
        }, _.random(1,2) * 1000 );

    }
});

module.exports = cancelOrder;
