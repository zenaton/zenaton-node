import Client from '../Client/Client'

let instance = null

module.exports = class Engine {
	constructor() {
		// singleton
		if (instance) { return instance }
		instance = this

		this.client = new Client()

		// executed by Zenaton worker
		this.worker = null
	}

	execute(jobs) {
		// check arguments'type
		this.checkArguments(jobs)

		// local execution
		if (this.worker == null || jobs.length == 0) {
			let outputs = []
			// simply apply handle method
			jobs.forEach(job => {
				outputs.push(job.handle())
			})
			// return results
			return outputs
		}

		// executed by Zenaton worker
		return this.worker.process(jobs, true)
	}

	dispatch(jobs) {
		// check arguments'type
		this.checkArguments(jobs)

		// local execution
		if (this.worker == null || jobs.length == 0) {
			let outputs = []
			// dispatch works to Zenaton (only workflows by now)
			jobs.forEach(job => {
				this.client.startWorkflow(job)
			})
			// return results
			return outputs
		}

		// executed by Zenaton worker
		return this.worker.process(jobs, false)
	}

	checkArguments(jobs) {

	}
}
