const Client = require('../Client')

module.exports = class AbstractWorkflow {
	constructor(name) {
		// class name
		this.name = name
	}

	// dispatch function
	dispatch() {
		new Client().startWorkflow(this)
	}

	static methods() {
		return ['getId', 'onEvent', 'onStart', 'onSuccess', 'onFailure', 'onTimeout']
	}
}
