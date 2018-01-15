const AbstractWorkflow = require('./AbstractWorkflow')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')
const workflowManager = require('./WorkflowManager')
const Builder = require('../Query/Builder')

module.exports = function (name, flow) {

	// check that provided data have the right format
	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string (workflow name)')
	}
	// check definition
	if ('function' !== typeof flow && 'object' !== typeof flow) {
		throw new InvalidArgumentException('2nd parameter must be an function or an object (workflow implemention)')
	}
	if ('object' === typeof flow) {
		if ('function' !== typeof flow.handle) {
			throw new InvalidArgumentException('"handle" method must be a function')
		}
		AbstractWorkflow.methods().forEach(function(method) {
			if ((undefined !== flow[method]) && ('function' !== typeof flow[method])) {
				throw new InvalidArgumentException('"' + method + '" method must be a function')
			}
		})
	}

	let _useInit = true

	// WARNING "WorkflowClass" is used in Version.js, do not change it in isolation
	const WorkflowClass = class extends AbstractWorkflow {
		constructor(...data) {
			super(name)

			// if this workflow defined by a simple function?
			let isFn = ('function' === typeof flow)

			// set instance data
			if (false === _useInit || isFn || undefined === flow['init']) {
				this.data = data[0]
			} else {
				this.data = {}
				flow['init'].bind(this.data)(...data)
			}

			// set and bind instance methods
			if (isFn) {
				this.handle = flow.bind(this.data)
			} else {
				let that = this
				Object.keys(flow).forEach( method => {
					if ('init' !== method) {
						if (AbstractWorkflow.methods().indexOf(method) < 0) {
							// private method
							if (undefined !== that.data[method]) {
								throw new InvalidArgumentException('"' + method + '" is defined more than once in "' + name + '" workflow')
							}
							that.data[method] = flow[method].bind(that.data)
						} else {
							// zenaton method
							that[method] = flow[method].bind(that.data)
						}
					}
				})
			}
		}

		/**
		 * set canonical name (used by Version)
		 */
		_setCanonical(canonical) {
			this.canonical = canonical

			return this
		}

		/**
		 * get canonical name
		 */
		_getCanonical() {
			return this.canonical
		}

		/**
		 * ORM begin
		 */
		static whereId(id) {
			return (new Builder(name)).whereId(id)
		}

		/**
		 * static methods used to tell class to
		 * not use construct method to inject data
		 */
		static get _useInit() { return _useInit }
		static set _useInit(value) { _useInit = value }
	}

	// store this fonction in a singleton to retrieve it later
	workflowManager.setClass(name, WorkflowClass)

	return WorkflowClass
}
