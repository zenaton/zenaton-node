import Client from 'Tasky-Client';

// Client
import OnBoardingWorkflow from './myApp'
// Credentials
let client = new Client(appid, apikey, appenv);

// With Object ?
let client = new Client({
    appid: appid,
    apikey: apikey,
    appenv: appenv
});


const w = client.start(OnBoardingWorkflow, {
    engaged: false,
    email: 'tj@learnboost.com'
});

// Retrieving instance
const wFound = client.find('OnBoardingWorkflow').byId('toto@email.co');

w.dispatch('myEvent', dataevent);
w.pause();
w.resume();
w.kill();

// Worker
import { Task, Workflow, Wait } from 'Tasky-Worker';

const OnBoardingWorkflow = new Workflow({
    properties: () => ({
        engaged: false,
        email: null
    }),
    handle: function(data, done) {

        let [a, b] = execute(
            SendWelcomeEmail(data),
            SendOtherTask(data)
        );

        if (this.engaged) {
            (new Wait).days(2).execute();
        }

        done(null, result);
        // or
        done(error);
    },
    onEvent: function(event, done) {
        // event = {name: '', data: {}}
        if (event.name === 'EngagedEvent') {
            this.engaged = true;
        }

        done();
    },
    id: function () {
        return this.email;
    }
});

const SendWelcomeEmail = new Task({
    handle: function (data, done) {
        // ...
    },
    timeout: () => 20
});

// synchroneous execution
SendWelcomeEmail().handle(data);
OnBoardingWorkflow(data).handle();
