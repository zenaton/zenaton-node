const Client = require('./Client')
const Event = require('./Events/Event')
const Task = require('./Tasks/Task')
const Wait = require('./Tasks/Wait')
const Workflow = require('./Workflows/Workflow')
const TaskManager = require('./Managers/TaskManager')
const WorkflowManager = require('./Managers/WorkflowManager')
const {ExternalZenatonException, InternalZenatonException, InvalidArgumentException} = require('./Exceptions')
const Parallel = require('./Parallel/Parallel')

// store path to this file
// for use by Zenaton worker
process.env.ZENATON_PATH = require('path').resolve(__dirname, __filename)

// define parallel global function
if (undefined === typeof global.parallel) {
	global.parallel = (...tasks) => {
		return (new Parallel(tasks))
	}
}

export {
	Client,
	Event,
	Task,
	Wait,
	Workflow,
	TaskManager,
	WorkflowManager,
	ExternalZenatonException,
	InternalZenatonException,
	InvalidArgumentException
}
