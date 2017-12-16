import request from 'sync-request'

export const get = (url) => {
	const response = request('GET', url)
	return parseBody(response)
}

export const post = (url, body) => {

	try {
		const response = request('POST', url, {
			json: body
		})
		return parseBody(response)
	} catch (e) {
		console.log(e)
		const response = {}
		const port = (process.env.ZENATON_WORKER_PORT) ? process.env.ZENATON_WORKER_PORT : 4001
		response.error = 'Connection Problem. Please Check that you\'ve started a zenaton_worker or ensure that PORT ' + port +' is available.'
		return response
	}
}

export const put = (url, body) => {

	const response = request('PUT', url, {
		json: body
	})
	return parseBody(response)
}

const parseBody = (response) => {
	return JSON.parse(response.body.toString('utf8'))
}
