const ZenatonException = require('./ZenatonException')

module.exports = class extends ZenatonException {
	constructor(message) {
		super(message)
		this.name = this.constructor.name
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		} else {
			this.stack = (new Error(message)).stack
		}
	}
}
