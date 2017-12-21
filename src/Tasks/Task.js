const AbstractTask = require('./AbstractTask')
const TaskManager = require('./TaskManager')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

module.exports = function Task(name, handle) {

	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string')
	}
	if ('function' !== typeof handle) {
		throw new InvalidArgumentException('2nd parameter must be an object')
	}

	const task = class extends AbstractTask {
		constructor(data) {
			super(name, handle)

			// instance data
			this.data = data

			// handle method binded on data
			this.handle = handle.bind(this.data)
		}
	}

	const taskManager = new TaskManager()
	taskManager.setTask(name, task)

	return task
}
