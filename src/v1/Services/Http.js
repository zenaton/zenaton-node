const axios = require('axios')
const {ExternalZenatonError, InternalZenatonError, ZenatonError} = require('../../Errors')

const getError = (e) => {
	if (undefined === e.response) {
		return e
	}
	// get message as status text
	let message = ('string' !== typeof e.response.statusText) ? 'Unknown error' : e.response.statusText
	// get status code
	if (e.response.status !== parseInt(e.response.status)) {
		return new ZenatonError(message + ' - please contact Zenaton support')
	}
	// Internal Server Error
	if (e.response.status >= 500) {
		return new InternalZenatonError(message + ' - please contact Zenaton support')
	}
	// User error
	if (undefined === e.response.data || 'string' !== typeof e.response.data.error) {
		return new ExternalZenatonError(message)
	}
	return new ExternalZenatonError(e.response.data.error)
}

const get = (url) => {
	return axios.get(url)
		.then( result => {
			return result.data
		})
		.catch ( error => {
			throw getError(error)
		})
}

const post = (url, body) => {
	return axios.post(url, body)
		.then( result => {
			return result.data
		})
		.catch ( error => {
			throw getError(error)
		})
}

const put = (url, body) => {
	return axios.put(url, body)
		.then( result => {
			return result.data
		})
		.catch ( error => {
			throw getError(error)
		})
}

export { get, post, put }
