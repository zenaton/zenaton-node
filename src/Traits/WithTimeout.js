const Trait = require('../Services/Trait')
const moment = require('moment-timezone')
const WithDuration = require('./WithDuration')

module.exports = Trait.mix({
	timestamp(timestamp) {
		this.getTimeoutMoment().unix(timestamp)

		return this
	},

	at(time) {
		const segments = time.split(':')
		const h = parseInt(segments[0])
		const m = segments.length > 1 ? parseInt(segments[1]) : 0
		const s = segments.length > 2 ? parseInt(segments[2]) : 0

		const t = this.getTimeoutMoment().set('hour', h).set('minute', m).set('second', s);

		(this.timeoutNow).isAfter(t) ? t.add(1, 'days') : t

		return this
	},

	onDay(day) {
		const t = this.getTimeoutMoment()
		t.set('date', day);

		(this.timeoutNow).isAfter(t) ? t.add(1, 'months') : t

		return this
	},

	monday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	tuesday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	wednesday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	thursday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	friday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	saturday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	sunday(n = 1) {
		const t = this.getTimeoutMoment()

		return this
	},

	timezone(timezone) {
		this.getTimeoutMoment().tz(timezone).format()
		return this
	},

}, WithDuration)
