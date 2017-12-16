import _ from 'lodash';
import Microserver from './Microserver';
import WorkflowManager from './WorkflowManager';
import { ScheduledBoxException, InternalZenatonException }  from '../Exceptions';

class Decider {
    constructor(uuid) {
        this.microserver = (new Microserver()).setUuid(uuid);
        this.workflowManager = new WorkflowManager();
    }

    workflowExecute() {
        return this.microserver.getWorkflowToExecute()
    }

    isJson(item) {
        item = typeof item !== "string"
            ? JSON.stringify(item)
            : item;

            try {
                item = JSON.parse(item);
            } catch (e) {
                return false;
            }

            if (typeof item === "object" && item !== null) {
                return true;
            }

            return false;
    }

    launch() {
        let branch;
        while (! _.isEmpty(branch = this.workflowExecute())) {
            if (! _.isEmpty(branch)) {

                if (this.isJson(branch.properties)) {
                    if (typeof branch.properties === 'string') {
                        branch.properties = JSON.parse(branch.properties);
                    }
                }

                if (this.isJson(branch.event)) {
                    if (typeof branch.event === 'string') {
                        branch.event = JSON.parse(branch.event);
                    }
                }

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
                this.workflowManager.setCurrentWorkflow(this.flow);
                this.microserver.completeDecision();
                return;
            }

            if (e instanceof InternalZenatonException) {
                this.microserver.failDecider(e);
                this.microserver.reset();

                throw e;
            }

            this.microserver.failDecision(e);
            this.microserver.reset();
            throw e;
        }

        this.microserver.completeDecisionBranch(output);

    }
}

module.exports = Decider;
