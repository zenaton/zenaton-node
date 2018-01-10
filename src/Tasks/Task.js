const AbstractTask = require('./AbstractTask')
const taskManager = require('./TaskManager')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

module.exports = function (name, task) {

	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string')
	}
	// check definition
	if ('function' !== typeof task && 'object' !== typeof task) {
		throw new InvalidArgumentException('2nd parameter must be an function or an object (task implemention)')
	}
	if ('object' === typeof task) {
		if ('function' !== typeof task.handle) {
			throw new InvalidArgumentException('"handle" method must be a function')
		}
		AbstractTask.methods().forEach(function(method) {
			if ((undefined !== task[method]) && ('function' !== typeof task[method])) {
				throw new InvalidArgumentException('"' + method + '" method must be a function')
			}
		})
	}

	let _useConstruct = true

	const TaskClass = class extends AbstractTask {
		constructor(...data) {
			super(name)

			// if this task defined by a simple function?
			let isFn = ('function' === typeof task)

			// set instance data
			if (false === _useConstruct || isFn || undefined === task['construct']) {
				this.data = data[0]
			} else {
				this.data = {}
				task['construct'].bind(this.data)(...data)
			}

			// handle method binded on data
			this.handle = (isFn ? task : task.handle).bind(this.data)

			// set and bind instance methods
			if (! isFn) {
				let that = this
				AbstractTask.methods().forEach( method => {
					if (undefined !== task[method] && 'construct' !== method) {
						that[method] = task[method].bind(that.data)
					}
				})
			}
		}

		/**
		 * static methods used to tell class to
		 * not use construct method to inject data
		 */
		static get _useConstruct() { return _useConstruct }
		static set _useConstruct(value) { _useConstruct = value }
	}

	// store this fonction in a singleton to retrieve it later
	taskManager.setClass(name, TaskClass)

	return TaskClass
}
