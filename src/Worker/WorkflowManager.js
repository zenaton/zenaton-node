
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

    init(name, data, event) {
        const flow = this.getWorkflow(name);
        flow.setData(JSON.parse(data));

        return flow;
    }
}
