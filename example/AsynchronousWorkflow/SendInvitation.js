var Zenaton = require('../../lib/Worker');

var _ = require('lodash');

var orderFromProviderA = new Zenaton.Task({
    name: 'SendInvitation',
    handle: function(done) {
        console.log('Sending Invitation to: ' + this.firstname);
        var that = this;
        setTimeout(function(){
            console.log('Invitation Well sent to ' + that.firstname);
            done();
        }, _.random(1,3) * 1000 );

    }
});

module.exports = orderFromProviderA;
