import moment from 'moment'

const WithDuration = {

	getTimeoutTimestamp() {

		return (this.timeoutMoment) ? this.timeoutMoment.unix() : 2147483647
	},

	seconds(s) {
		this.getTimeoutMoment().add(s, 'seconds')

		return this
	},

	minutes(m) {
		this.getTimeoutMoment().add(m, 'minutes')

		return this
	},

	hours(h) {
		this.getTimeoutMoment().add(h, 'hours')

		return this
	},

	days(d) {
		this.getTimeoutMoment().add(d, 'days')

		return this
	},

	weeks(w) {
		this.getTimeoutMoment().add(w, 'weeks')

		return this
	},

	months(m) {
		this.getTimeoutMoment().add(m, 'months')

		return this
	},

	years(y) {
		this.getTimeoutMoment().add(y, 'years')

		return this
	},

	time_sleep_until(timestamp) {
		while( new Date() < timestamp * 1000) {}
		return true
	},

	getTimeoutMoment() {
		if(!this.timeoutMoment) {
			this.timeoutNow = moment()
			this.timeoutMoment = moment(this.timeoutNow)
		}

		return this.timeoutMoment
	}
}

export default WithDuration
