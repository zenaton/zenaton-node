import Microserver from './Microserver';
import WorkflowManager from './WorkflowManager';
import { ModifiedDeciderException, ScheduledBoxException }  from '../Common';

export default class Decider {
    constructor(uuid) {
        this.microserver = (new Microserver()).setUuid(uuid);
        this.workflowManager = new WorkflowManager();
    }

    launch() {
        let branch;
        this.microserver.getWorkflowToExecute()
            .then((branch => {

                this.flow = this.workflowManager.init(branch.name, branch.properties, branch.event);
                this.process();
            }))
            .catch((error) => {
                console.log(`error: ${error}`);
            });

        // this.microserver.reset();
    }

    process() {
        try {
            const output = this.flow.handle()
        } catch (e) {
            console.log("catching");
            // if (e instanceof ScheduledBoxException) {
            //     console.log("ScheduledBoxException dans decider");
            //     // this.microserver.completeDecision();
            //     return;
            // }
        }
    }
}
