import Client from '../Client'
import InvalidArgumentException from '../Exceptions/InvalidArgumentException'
import WorkflowManager from './WorkflowManager'

module.exports = function Workflow(name, flow) {

	// check that workflow has the right format
	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string')
	}
	if ('object' !== typeof flow) {
		throw new InvalidArgumentException('2nd parameter must be an object')
	}
	if ('function' !== typeof flow.handle) {
		throw new InvalidArgumentException('You must provide a "handle" function')
	}
	['getId', 'onEvent', 'onStart', 'onSuccess', 'onFailure', 'onTimeout'].forEach(function(method) {
		if ((undefined !== flow[method]) && ('function' !== typeof flow[method])) {
			throw new InvalidArgumentException('Your "' + method + '" method must be a function')
		}
	})

	const workflowClass = class {
		constructor(data) {
			this.name = name

			// instance data
			this.data = data

			// set and bind instance methods to data
			let that = this;
			['handle', 'getId', 'onEvent', 'onStart', 'onSuccess', 'onFailure', 'onTimeout'].forEach(function(method) {
				if (undefined !== flow[method]) {
					that[method] = flow[method].bind(that.data)
				}
			})

			// dispatch function
			this.dispatch = function() {
				new Client().startWorkflow(this)
			}
		}
	}

	const workflowManager = new WorkflowManager()
	workflowManager.setWorkflow(name, workflowClass)

	return workflowClass
}
