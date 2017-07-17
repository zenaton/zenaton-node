
var client = require('./client');
var sendInvitationsWorkflow = require('./AsynchronousWorkflow/SendInvitationsWorkflow');

var notifications = {
    names: ['Gilles', 'Julien', 'Oussama', 'Alice', 'Charlotte', 'Balthazar', 'Annabelle', 'Louis']
};

 var instance = client.start(sendInvitationsWorkflow(notifications));
 console.log('launched! ' + instance.getId());
