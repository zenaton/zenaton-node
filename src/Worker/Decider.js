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
        return this.microserver.getWorkflowToExecute()
    }
    launch() {
        let branch;
        while (! _.isEmpty(branch = this.workflowExecute())) {
            if (! _.isEmpty(branch)) {
                this.flow = this.workflowManager.init(branch.name, branch.properties, branch.event);
                this.process();
            }
        }
        this.microserver.reset();
    }

    process() {
        let output;
        try {
            output = this.flow.handle()
        } catch (e) {
            if (e instanceof ScheduledBoxException) {
                this.microserver.completeDecision();
                return;
            }
        }

        this.microserver.completeDecisionBranch(output);

    }
}
