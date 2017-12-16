import InvalidArgumentException from '../Exceptions/InvalidArgumentException'

module.exports = function Event(name) {

	if ('string' !== typeof name) {
		throw new InvalidArgumentException('1st parameter must be a string')
	}

	const EventClass = class {
		constructor(data) {
			this.name = name
			this.data = data
		}
	}

	return EventClass
}
