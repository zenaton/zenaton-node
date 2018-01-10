const serializer = require('../Services/Serializer')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

let instance

const WorkflowManager = class {
	constructor() {
		if (instance) { return instance }
		instance = this

		this.workflows = {}
	}

	setClass(name, workflow) {
		// check that this workflow does not exist yet
		if (undefined !== this.getClass(name)) {
			throw new InvalidArgumentException('"' + name + '" workflow can not be defined twice')
		}

		this.workflows[name] = workflow
	}

	getClass(name) {
		return this.workflows[name]
	}

	getWorkflow(name, encodedData) {
		// unserialize data
		const data = serializer.decode(encodedData)
		// get workflow class
		var workflowClass = this.getClass(name)
		// if Version => the workflow was versioned meanwhile => get the initial class
		if ('VersionClass' === workflowClass.constructor.name) {
			workflowClass = workflowClass.getInitialClass()
		}
		// do not use construct function to set data
		workflowClass._useConstruct = false
		// return new workflow instance
		return new workflowClass(data)
	}
}

module.exports = new WorkflowManager()
