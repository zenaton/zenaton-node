
var Zenaton = require('../../lib/Worker');

var sendInvitation = require('./SendInvitation');

var _ = require('lodash');


var SendInvitationsWorkflow = new Zenaton.Workflow({
    name: 'SendInvitationsWorkflow',

    handle: function() {

        _.each(this.names, (name) => {
            executeAsync(sendInvitation({firstname: name}))
        });

    }

});

module.exports = SendInvitationsWorkflow;
