import { watch } from 'watchJs';
import _ from 'lodash';
let instance = null;

class WorkflowManager {
    constructor() {
        if (instance) {
            return instance;
        }

        this.workflows = {};

        instance = this;
    }

    setWorkflow(workflowInstance) {
        this.workflows[workflowInstance.workflow.name] = workflowInstance;
    }

    getWorkflow(workflowName) {
        return this.workflows[workflowName];
    }

    getCurrentWorkflow() {
        return this.currentWorkflow;
    }

    setCurrentWorkflow(newCurrentWorkflow) {
        this.currentWorkflow = newCurrentWorkflow;
    }

    init(name, data, event) {
        const workflow = this.getWorkflow(name);
        workflow.setData(data);
        workflow.position.init();
        workflow.setEvent(JSON.parse(event));

        this.setCurrentWorkflow(workflow);
        
        return workflow;
    }
}

module.exports = WorkflowManager;
