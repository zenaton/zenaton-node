const TaskManager = require('../Managers/TaskManager')
const Engine = require('../Engine/Engine')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

module.exports = function Task(name, handle) {

	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string')
	}
	if ('function' !== typeof handle) {
		throw new InvalidArgumentException('2nd parameter must be an object')
	}

	const task = class {
		constructor(data) {
			let that = this

			this.name = name
			this.data = data

			// ensure handle function is called
			// with right context
			// let binded = handle.bind(this)

			// let promiseHandle = function () {
			// 	return new Promise(function (resolve, reject) {
			// 		// call handle with custom done function
			// 		binded(function(err, data) {
			// 			if (err) return reject(err)
			// 			resolve(data)
			// 		})
			// 	})
			// }

			//
			this.handle = handle.bind(this.data)

			// asynchroneous execution within a workflow
			this.dispatch = function () {
				new Engine().dispatch([that])[0]
			}

			// synchroneous execution within a workflow
			this.execute = function () {
				return new Engine().execute([that])[0]
			}
		}
	}

	const taskManager = new TaskManager()
	taskManager.setTask(name, task)

	return task
}
