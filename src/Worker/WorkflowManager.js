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
        this.updateProperties(workflow);

        return workflow;
    }


    updateProperties(workflow) {

        const keys = _.keys(workflow.workflow);
        const keyToWatch = _.difference(keys, ['name', 'handle', 'data', 'event', 'onEvent']);
        _.each(keyToWatch, (k) => {
            watch(workflow.workflow, k, () => {
                workflow.workflow.data[k] = workflow.workflow[k];
            })
        });
    }
}

module.exports = WorkflowManager;
