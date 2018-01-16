const Client = require('../Client')

let instance = null

module.exports = class Engine {
	constructor() {
		// singleton
		if (instance) { return instance }
		instance = this

		this.client = new Client()

		// No processor
		this.processor = null
	}

	setProcessor(processor) {
		this.processor = processor
	}

	execute(jobs) {

		// check arguments'type
		this.checkArguments(jobs)

		// local execution
		if (this.processor === null || jobs.length == 0) {
			let outputs = []
			// simply apply handle method
			jobs.forEach(job => {
				outputs.push(job.handle())
			})
			// return results
			return outputs
		}

		// executed by Zenaton processor
		return this.processor.process(jobs, true)
	}

	dispatch(jobs) {
		// check arguments'type
		this.checkArguments(jobs)

		// local execution
		if (this.processor === null || jobs.length == 0) {
			let outputs = []
			// dispatch works to Zenaton (only workflows by now)
			jobs.forEach(job => {
				this.client.startWorkflow(job)
			})
			// return results
			return outputs
		}

		// executed by Zenaton processor
		return this.processor.process(jobs, false)
	}

	checkArguments(jobs) {
		jobs.forEach( job => {
			// if ( ('object' !== typeof job) || (!( Task instanceof job) && !( Workflow instanceof job))) {
			// 	throw new InvalidArgumentException(
			// 		'You can only execute or dispatch Zenaton Task or Workflow'
			// 	)
			// }
		})
	}
}
