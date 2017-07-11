
var Zenaton = require('../../lib/Worker');

var SendInvitationWorkflow = new Zenaton.Workflow({
    name: 'SendInvitationWorkflow',
    data: function() {
        return {
            invitations: null,
        }
    },
    handle: function() {
        console.log('SendInvitationWorkflow');
    }

});

module.exports = SendInvitationWorkflow;
