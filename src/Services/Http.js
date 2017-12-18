const axios = require('axios')

const get = (url) => {
	return axios.get(url)
		.then( result => {
			return result.data
		})
		.catch ( error => {
			console.log(error)
		})
}

const post = (url, body) => {
	return axios.post(url, body)
		.then( result => {
			return result.data
		})
		.catch ( error => {
			console.log(error)
		})
}

const put = (url, body) => {
	return axios.put(url, body)
		.then( result => {
			return result.data
		})
		.catch ( error => {
			console.log(error)
		})
}

export { get, post, put }
