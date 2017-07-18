var Zenaton = require('../../lib/Worker');

var _ = require('lodash');

var prepareOrder = new Zenaton.Task({
    name: 'PrepareOrder',
    handle: function(done) {
        console.log('Preparing order for item: ' + this.item);

        setTimeout(function(){
            console.log('Order prepared');
            done();
        }, _.random(5,10) * 1000 );

    }
});

module.exports = prepareOrder;
