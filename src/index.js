// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = require('path').resolve(__dirname, __filename)

const Client = require('./Client')
const Event = require('./Events/Event')
const Engine = require('./Engine/Engine')
const { AbstractTask, Task, Wait, TaskManager } = require('./Tasks')
const { AbstractWorkflow, Workflow, WorkflowManager } = require('./Workflows')
const Exceptions = require('./Exceptions')
const Parallel = require('./Parallel/Parallel')

// define parallel global function
if (undefined === typeof global.parallel) {
	global.parallel = (...tasks) => {
		return (new Parallel(tasks))
	}
}

module.exports = {
	Client,
	Event,
	Engine,
	AbstractTask,
	Task,
	Wait,
	TaskManager,
	AbstractWorkflow,
	Workflow,
	WorkflowManager,
	Exceptions
}
