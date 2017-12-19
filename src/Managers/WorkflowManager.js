let instance

module.exports = class WorkflowManager {
	constructor() {
		if (instance) { return instance }
		instance = this

		this.workflows = {}
	}

	setWorkflow(name, workflow) {
		this.workflows[name] = workflow
	}

	getWorkflow(name, data) {
		return new this.workflows[name](data)
	}
}
