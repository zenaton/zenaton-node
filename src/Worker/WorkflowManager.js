
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

    init(name, data, event) {
        const workflow = this.getWorkflow(name);
        workflow.setData(JSON.parse(data))
        workflow.position.init();
        this.currentWorkflow = workflow;
        return workflow;
    }
}
