let instance

module.exports = class TaskManager {
	constructor() {
		if (instance) { return instance }
		instance = this

		this.tasks = {}
	}

	setTask(name, task) {
		this.tasks[name] = task
	}

	getTask(name, data) {
		return new this.tasks[name](data)
	}

	getClass(name) {
		return this.tasks[name]
	}
}
