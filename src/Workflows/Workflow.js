const AbstractWorkflow = require('./AbstractWorkflow')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')
const WorkflowManager = require('./WorkflowManager')
const Builder = require('../Query/builder')

module.exports = function Workflow(name, handle, options = {}) {

	// check that provided data have the right format
	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string (workflow name)')
	}
	if ('function' !== typeof handle) {
		throw new InvalidArgumentException('2nd parameter must be an function (workflow implementation)')
	}
	if ('object' !== typeof options) {
		throw new InvalidArgumentException('3rd parameter must be an object (workflow options)')
	}
	AbstractWorkflow.methods().forEach(function(method) {
		if ((undefined !== options[method]) && ('function' !== typeof options[method])) {
			throw new InvalidArgumentException(method + '" method must be a function')
		}
	})

	const Workflow = class extends AbstractWorkflow {
		constructor(data) {
			super(name)
			let that = this

			// data instance
			this.data = data

			// set and bind handle function
			this.handle = handle.bind(this.data)

			// set and bind instance methods
			AbstractWorkflow.methods().forEach( method => {
				if (undefined !== options[method]) {
					that[method] = options[method].bind(that.data)
				}
			})

		}

		static whereId(id) {
			return (new Builder(name)).whereId(id)
		}
	}

	// store this fonction in a singleton to retrieve it later
	new WorkflowManager().setWorkflow(name, Workflow)

	return Workflow
}
