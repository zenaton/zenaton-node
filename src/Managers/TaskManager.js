let instance

class TaskManager {
	constructor() {
		if (instance) { return instance }
		instance = this

		this.tasks = {}
	}

	setTask(name, task) {
		this.tasks[name] = task
	}

	getTaskByName(name) {
		return this.tasks[name]
	}

	getCurrentTask() {
		return this.currentTask
	}

	init(name, data) {
		const task = this.getTaskByName(name)
		task.setData(data)
		this.currentTask = task
		return task
	}
}

module.exports = TaskManager
