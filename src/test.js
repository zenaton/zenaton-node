import Client from './Client';
import { Workflow } from './Worker';

const client = new Client('PFTLSCKGRZ', 'sySpdVnTYcR0ECffwWRKHPe63YxU9wzC9jQxsUuQJkIlHITcRe5VzFVoQdwa', 'production');


const onBoardingWorkflow = new Workflow({
    name: 'OnBoardingWorkflow',
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
        if (event.name === 'EngagedEvent') {
            this.engaged = true;
        }
    },
    id() {
        return this.email;
    }
});
//
// const w = client.start(onBoardingWorkflow, {
//     engaged: false,
//     email: 'tj@learnboost.com'
// });
