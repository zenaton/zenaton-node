const serializer = require('../Services/Serializer')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

let instance

const TaskManager = class {
	constructor() {
		if (instance) { return instance }
		instance = this

		this.tasks = {}
	}

	setClass(name, task) {
		// check that this workflow does not exist yet
		if (undefined !== this.getClass(name)) {
			throw new InvalidArgumentException('"' + name + '" task can not be defined twice')
		}

		this.tasks[name] = task
	}

	getClass(name) {
		return this.tasks[name]
	}

	getTask(name, encodedData) {
		// unserialize data
		const data = serializer.decode(encodedData)
		// get task class
		var taskClass = this.getClass(name)
		// do not use construct function to set data
		taskClass._useConstructor = false
		// return new task instance
		return new taskClass(data)
	}
}

module.exports = new TaskManager()
