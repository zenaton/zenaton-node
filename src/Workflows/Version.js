const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')
const workflowManager = require('./WorkflowManager')
const AbstractWorkflow = require('./AbstractWorkflow')
const Builder = require('../Query/Builder')

module.exports = function (name, implementation) {

	// check that provided data have the right format
	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string (workflow name)')
	}
	// get versions
	let versions
	if (Array.isArray(implementation)) {
		versions = implementation
	} else {
		if ('object' === typeof implementation) {
			if ('function' === typeof implementation.versions) {
				versions = versions.versions()
				if (! Array.isArray(versions)) {
					throw new InvalidArgumentException('"versions" method should return an array')
				}
			} else {
				throw new InvalidArgumentException('You must have a "versions" method')
			}
		} else {
			throw new InvalidArgumentException('2nd parameter must be an array or an object')
		}
	}

	// should be at least 1
	if (versions.length === 0) {
		throw new InvalidArgumentException('versions array must have at least one element')
	}

	// check type
	versions.forEach(flow => {
		if ('function' !== typeof flow || !(flow.prototype instanceof AbstractWorkflow)) {
			throw new InvalidArgumentException('element of versions array should be workflow class')
		}
	})

	// WARNING "VersionClass" is used in WorkflowManager.js, do not update it in isolation
	const VersionClass = class {
		constructor(...data) {
			// return instance of current class
			return new (versions[versions.length - 1])(...data)._setCanonical(name)
		}

		static getCurrentClass() {
			return versions[versions.length - 1]
		}

		static getInitialClass() {
			return versions[0]
		}

		static whereId(id) {
			return (new Builder(name)).whereId(id)
		}
	}

	// store this fonction in a singleton to be able to retrieve it later
	workflowManager.setClass(name, VersionClass)

	return VersionClass
}
