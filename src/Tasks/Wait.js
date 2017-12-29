const AbstractTask = require('./AbstractTask')
const Trait = require('../Services/Trait')
const WithTimestamp = require('../Traits/WithTimestamp')
const { ExternalZenatonException } = require('../Exceptions')
const moment = require('moment-timezone')

const Wait = class extends AbstractTask {
	constructor(event =  null) {
		if (event !== null && (typeof event !== 'string')) {
			throw new ExternalZenatonException('1st parameter, if any, must be a string (event name)')
		}

		super('Wait')

		this.event = event
	}

	handle() {
		//
	}

	// static method can not be defined by trait :(
	static timezone(timezone)
	{
		if (moment.tz.names().indexOf(timezone) < 0) {
			throw new ExternalZenatonException('Unknown timezone')
		}

		this._timezone = timezone
	}
}

module.exports = Trait.apply(Wait, WithTimestamp)
