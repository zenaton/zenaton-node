
var Client = require('../lib/Client');
var Config = require('./config.js');
var client = new Client(Config.app_id, Config.api_token, Config.app_env);


var Workflow = require('../lib/Worker').Workflow;

var onBoardingWorkflow = new Workflow({
    name: 'OnBoardingWorkflow',
    properties: function() {
        return {
            engaged: false,
            email: null
        }
    },
    handle: function(data) {
        var [a, b] = execute(
            SendWelcomeEmail(data),
            SendOtherTask(data)
        );
        if (this.engaged) {
            (new Wait).days(2).execute();
        }
    },
    onEvent: function(event) {
        if (event.name === 'EngagedEvent') {
            this.engaged = true;
        }
    },
    id: function() {
        return this.email;
    }
});


 var w = client.start(onBoardingWorkflow, {
    engaged: false,
    email: 'tj@learnboost.com'
});
