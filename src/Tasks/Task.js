import TaskManager from '../Managers/TaskManager'
import InvalidArgumentException from '../Exceptions/InvalidArgumentException'

module.exports = function Task(name, handle) {

	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string')
	}
	if ('function' !== typeof handle) {
		throw new InvalidArgumentException('2nd parameter must be an object')
	}

	const task = class {
		constructor(data) {
			this.name = name
			this.data = data

			// ensure handle function is called
			// with right context
			let binded = handle.bind(this)

			let promiseHandle = function () {
				return new Promise(function (resolve, reject) {
					// call handle with custom done function
					binded(function(err, data) {
						if (err) return reject(err)
						resolve(data)
					})
				})
			}

			this.handle = handle

			this.execute = promiseHandle

			this.dispatch = promiseHandle
		}
	}

	const taskManager = new TaskManager()
	taskManager.setTask(name, task)

	return task
}
