import { watch } from 'watchJs';
import _ from 'lodash';
let instance = null;

export default class WorkflowManager {
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
        _.each(workflow.workflow.data, (p, k) => {
            watch(workflow.workflow, k, () => {
                workflow.workflow.data[k] = workflow.workflow[k];
            })
        });
        return workflow;
    }
}
