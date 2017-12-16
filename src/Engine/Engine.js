import _ from 'lodash'

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
		if (this.worker == null) {
			let outputs = []
			_.each(jobs, (job) => {
				outputs.push(job.handle())
			})

			return (jobs.length > 1) ? outputs : outputs[0]
		}

		// executed by Zenaton worker
		return this.worker.doExecute(jobs, true)
	}

	dispatch(jobs) {
		// check arguments'type
		this.checkArguments(jobs)

		// local execution
		if (this.worker == null) {
			// dispatch works to Zenaton (only workflows by now)
			_.each(jobs, (job) => {
				this.client.startWorkflow(job)
			})
			// return nothing
			return
		}

		// executed by Zenaton worker
		return this.worker.doExecute(jobs, false)
	}

	checkArguments(jobs) {

	}
}
