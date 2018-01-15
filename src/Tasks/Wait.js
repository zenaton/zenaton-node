const { InvalidArgumentException } = require('../Exceptions')
const Task = require('./Task')
const Trait = require('../Services/Trait')
const WithTimestamp = require('../Traits/WithTimestamp')
const moment = require('moment-timezone')

let WaitClass = Task('_Wait', {
	init(event = null) {
		if (event !== null && (typeof event !== 'string')) {
			throw new InvalidArgumentException('1st parameter, if any, must be a string (event name)')
		}
		this.event = event
	},
	handle() {
		//
	}
})

// 	static method can not be defined by trait :(
WaitClass.timezone = function(timezone){
	if (moment.tz.names().indexOf(timezone) < 0) {
		throw new InvalidArgumentException('Unknown timezone')
	}

	this._timezone = timezone
}

module.exports = Trait.apply(WaitClass, WithTimestamp)
