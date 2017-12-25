const AbstractWorkflow = require('./AbstractWorkflow')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')
const WorkflowManager = require('./WorkflowManager')
const Builder = require('../Query/Builder')

module.exports = function (name, flow) {

	// check that provided data have the right format
	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string (workflow name)')
	}
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

	const Workflow = class extends AbstractWorkflow {
		constructor(data) {
			super(name)
			let that = this

			// data instance
			this.data = data

			// defined by a simple function?
			let isFn = ('function' === typeof flow)

			// set and bind handle function
			this.handle = (isFn ? flow : flow.handle).bind(this.data)

			// set and bind instance methods
			if (! isFn) {
				AbstractWorkflow.methods().forEach( method => {
					if (undefined !== flow[method]) {
						that[method] = flow[method].bind(that.data)
					}
				})
			}
		}

		static whereId(id) {
			return (new Builder(name)).whereId(id)
		}
	}

	// store this fonction in a singleton to retrieve it later
	new WorkflowManager().setWorkflow(name, Workflow)

	return Workflow
}
