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

	let _useConstruct = true

	// WARNING "WorkflowClass" is used in Version.js, do not update it alone
	const WorkflowClass = class extends AbstractWorkflow {
		constructor(...data) {
			super(name)

			// if this workflow defined by a simple function?
			let isFn = ('function' === typeof flow)

			// set instance data
			if (false === _useConstruct || isFn || undefined === flow['construct']) {
				this.data = data[0]
			} else {
				this.data = {}
				flow['construct'].bind(this.data)(...data)
			}

			// set and bind handle function
			this.handle = (isFn ? flow : flow.handle).bind(this.data)

			// set and bind instance methods
			if (! isFn) {
				let that = this
				AbstractWorkflow.methods().forEach( method => {
					if (undefined !== flow[method] && 'construct' !== method) {
						that[method] = flow[method].bind(that.data)
					}
				})
			}
		}

		setCanonical(canonical) {
			this.canonical = canonical

			return this
		}

		getCanonical() {
			return this.canonical
		}

		static whereId(id) {
			return (new Builder(name)).whereId(id)
		}

		/**
		 * static methods used to tell class to
		 * not use construct method to inject data
		 */
		static get _useConstruct() { return _useConstruct }
		static set _useConstruct(value) { _useConstruct = value }
	}

	// store this fonction in a singleton to retrieve it later
	workflowManager.setClass(name, WorkflowClass)

	return WorkflowClass
}
