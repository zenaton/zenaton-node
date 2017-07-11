
var Client = require('../lib/Client');
var Config = require('./config.js');
var client = new Client(Config.app_id, Config.api_token, Config.app_env);
var transportBookingWorkflow = require('./SequentialWorkflow/TransportBookingWorkflow');

var data = {
    booking: {
        trip: {
            id: '1234567890',
            customer_id: '1234567891'
        },
        byCar: true,
        byAir: true
    }
};

 var w = client.start(transportBookingWorkflow(data));
