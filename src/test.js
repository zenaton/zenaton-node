import Client from './Client';
import { Workflow } from './Worker';

const client = new Client('app', 'token', 'environ');
const OnBoardingWorkflow = new Workflow({
    properties() {
        return {
            engaged: false,
            email: null
        }
    },
    handle(data) {
        const [a, b] = execute(
            SendWelcomeEmail(data),
            SendOtherTask(data)
        );
        if (this.engaged) {
            (new Wait).days(2).execute();
        }
    },
    onEvent(event) {
        // event = {name: '', data: {}}
        if (event.name === 'EngagedEvent') {
            this.engaged = true;
        }
    },
    id() {
        return this.email;
    }
});

const w = client.start(OnBoardingWorkflow, {
    engaged: false,
    email: 'tj@learnboost.com'
});


console.log(w);
