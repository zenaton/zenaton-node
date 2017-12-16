let instance;

module.exports = class WorkflowManager {
    constructor() {
        if (instance) { return instance; }
        instance = this;

        this.workflows = {};
    }

    setWorkflow(name, workflow) {
        this.workflows[name] = workflow;
    }

    getWorkflow(name) {
        return this.workflows[name];
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
        workflow.setEvent(event);

        this.setCurrentWorkflow(workflow);

        return workflow;
    }
}
