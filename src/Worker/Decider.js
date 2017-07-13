import _ from 'lodash';
import Microserver from './Microserver';
import WorkflowManager from './WorkflowManager';
import { ModifiedDeciderException, ScheduledBoxException }  from '../Common/Exceptions';

export default class Decider {
    constructor(uuid) {
        this.microserver = (new Microserver()).setUuid(uuid);
        this.workflowManager = new WorkflowManager();
    }

    workflowExecute() {
        console.log("a");
        return this.microserver.getWorkflowToExecute()
    }
    launch() {
        let branch;
        // do {
        //     branch = this.workflowExecute();
        //     if (! _.isEmpty(branch)) {
        //         this.flow = this.workflowManager.init(branch.name, branch.properties, branch.event);
        //         this.process();
        //     }
        // } while (! _.isEmpty(branch));

        while (! _.isEmpty(branch = this.workflowExecute())) {
            console.log("branch");
            console.log(branch);

            if (! _.isEmpty(branch)) {
                this.flow = this.workflowManager.init(branch.name, branch.properties, branch.event);
                this.process();
            }
            // break;
        }
        this.microserver.reset();
    }

    process() {
        let output;
        try {
            output = this.flow.handle()
        } catch (e) {
            if (e instanceof ScheduledBoxException) {
                console.log("ScheduledBoxException dans decider");
                this.microserver.completeDecision();
                return;
            }
        }
        console.log("final output");
        this.microserver.completeDecisionBranch(output);

    }
}
