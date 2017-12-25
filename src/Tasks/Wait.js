const Trait = require('../Services/Trait')
const { ExternalZenatonException } = require('../Exceptions')
const WithTimeout = require('../Traits/WithTimeout')

const Wait = class {
	constructor(event = null) {

		if (event !== null && (typeof event !== 'string')) {
			throw new ExternalZenatonException('1st parameter, if any, must be a string (event name)')
		}

		this.name = 'Wait'
		this.event = event
	}

	handle() {
		// this.time_sleep_until(this.getTimeoutTimestamp())
	}

	getEvent() {
		return this.event
	}
}

module.exports = Trait.apply(Wait, WithTimeout)
