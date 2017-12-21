/* global process, __dirname, __filename */

// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = require('path').resolve(__dirname, __filename)

const Client = require('./Client')
const Engine = require('./Engine/Engine')
const { AbstractTask, Task, Wait, TaskManager } = require('./Tasks')
const { AbstractWorkflow, Workflow, WorkflowManager } = require('./Workflows')
const Exceptions = require('./Exceptions')
const Parallel = require('./Parallel/Parallel')

// define parallel global function
if (undefined === global.parallel) {
	global.parallel = (...tasks) => {
		return (new Parallel(tasks))
	}
}

module.exports = {
	Client,
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
