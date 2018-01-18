/* global process, __dirname, __filename */

// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = require('path').resolve(__dirname, __filename)

const Client = require('./Client')
const Engine = require('./Engine/Engine')
const { AbstractTask, Task, Wait, taskManager } = require('./Tasks')
const { Version, AbstractWorkflow, Workflow, workflowManager } = require('./Workflows')
const Errors = require('./Errors')
const serializer = require('./Services/Serializer')
const Parallel = require('./Parallel/Parallel')



// Parallel dispatchs
if (!Array.prototype.dispatch) {
	Array.prototype.dispatch = function() {
		new Engine().dispatch(this)
	}
}

// Parallel executions
if (!Array.prototype.execute) {
	Array.prototype.execute = function() {
		return new Engine().execute(this)
	}
}

module.exports = {
	Client,
	Engine,
	serializer,
	Parallel,
	AbstractTask,
	Task,
	Wait,
	taskManager,
	Version,
	AbstractWorkflow,
	Workflow,
	workflowManager,
	Errors
}
