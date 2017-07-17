var Zenaton = require('../../lib/Worker');

var orderFromProviderB = new Zenaton.Task({
    name: 'OrderFromProviderB',
    handle: function(done) {
        console.log('Order "' + this.item + '" from Provider B');
        done();

    }
});

module.exports = orderFromProviderB;
