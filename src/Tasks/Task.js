const AbstractTask = require('./AbstractTask')
const taskManager = require('./TaskManager')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

module.exports = function (name, task) {

	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter (task name) must be a string')
	}
	// check definition
	if ('function' !== typeof task && 'object' !== typeof task) {
		throw new InvalidArgumentException('2nd parameter (task implemention) must be an function or an object ')
	}
	if ('object' === typeof task) {
		if (undefined == task.handle) {
			throw new InvalidArgumentException('Your task must define at least a "handle" method')
		}
		Object.keys(task).forEach(function (method) {
			if ('function' !== typeof task[method]) {
				throw new InvalidArgumentException('Task\'s methods must be functions - check value of "' + method + '"')
			}
		})
	}

	let _useConstructor = true

	const TaskClass = class extends AbstractTask {
		constructor(...data) {
			super(name)

			// if this task defined by a simple function?
			let isFn = ('function' === typeof task)

			// set instance data
			if (false === _useConstructor || isFn || undefined === task['constructor']) {
				this.data = data[0]
			} else {
				this.data = {}
				task['constructor'].bind(this.data)(...data)
			}

			// handle method binded on data
			this.handle = (isFn ? task : task.handle).bind(this.data)

			// set and bind instance methods
			if (! isFn) {
				let that = this
				Object.keys(task).forEach( method => {
					if ('constructor' !== method) {
						if (AbstractTask.methods().indexOf(method) < 0) {
							// private method
							if (undefined !== that.data[method]) {
								throw new InvalidArgumentException('"' + method + '" is defined more than once in "' + name + '" task')
							}
							that.data[method] = task[method].bind(that.data)
						} else {
							// zenaton method
							that[method] = task[method].bind(that.data)
						}
					}
				})
			}
		}

		/**
		 * static methods used to tell class to
		 * not use construct method to inject data
		 */
		static get _useConstructor() { return _useConstructor }
		static set _useConstructor(value) { _useConstructor = value }
	}

	// store this fonction in a singleton to retrieve it later
	taskManager.setClass(name, TaskClass)

	return TaskClass
}
