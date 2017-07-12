import Microserver from './Microserver';
import WorkflowManager from './WorkflowManager';
import { ModifiedDeciderException, ScheduledBoxException }  from '../Common/Exceptions';
import _ from 'lodash';

export default class Decider {
    constructor(uuid) {
        this.microserver = (new Microserver()).setUuid(uuid);
        this.workflowManager = new WorkflowManager();
    }

    workflowExecute() {
        return this.microserver.getWorkflowToExecute()
    }
    launch() {
        let branch;
        do {
            branch = this.workflowExecute();
            if (! _.isEmpty(branch)) {
                this.flow = this.workflowManager.init(branch.name, branch.properties, branch.event);
                this.process();
            }
        } while (! _.isEmpty(branch));

        this.microserver.reset();
    }

    process() {
        try {
            const output = this.flow.handle()
        } catch (e) {
            if (e instanceof ScheduledBoxException) {
                console.log("ScheduledBoxException dans decider");
                this.microserver.completeDecision();
                return;
            }
        }
    }
}
