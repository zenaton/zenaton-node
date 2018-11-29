/* global process */
const ExternalZenatonError = require('../Errors/ExternalZenatonError')
const InvalidArgumentError = require('../Errors/InvalidArgumentError')
const workflowManager = require('./Workflows/WorkflowManager')
const http = require('./Services/Http')
const serializer = require('./Services/Serializer')

const ZENATON_API_URL = 'https://zenaton.com/api/v1'
const ZENATON_WORKER_URL = 'http://localhost'
const DEFAULT_WORKER_PORT = 4001
const WORKER_API_VERSION = 'v_newton'

const MAX_ID_SIZE = 256

const APP_ENV = 'app_env'
const APP_ID = 'app_id'
const API_TOKEN = 'api_token'

const ATTR_ID = 'custom_id'
const ATTR_NAME = 'name'
const ATTR_CANONICAL = 'canonical_name'
const ATTR_DATA = 'data'
const ATTR_PROG = 'programming_language'
const ATTR_MODE = 'mode'

const PROG = 'Javascript'

const EVENT_INPUT = 'event_input'
const EVENT_NAME = 'event_name'

const WORKFLOW_KILL = 'kill'
const WORKFLOW_PAUSE = 'pause'
const WORKFLOW_RUN = 'run'

let instance

module.exports = class Client {

	constructor(worker = false) {
		if (instance) {
			if (! worker && (! instance.appId || ! instance.apiToken || ! instance.appEnv)) {
				console.log('Please initialize your Zenaton client with your credentials')
				// throw new ExternalZenatonError('Please initialize your Zenaton client with your credentials')
			}
			return instance
		}
		instance = this
	}

	static init(appId, apiToken, appEnv) {
		// store credentials in singleton
		new Client()
			.setAppId(appId)
			.setApiToken(apiToken)
			.setAppEnv(appEnv)
	}

	setAppId(appId) {
		this.appId = appId

		return this
	}

	setApiToken(apiToken) {
		this.apiToken = apiToken

		return this
	}

	setAppEnv(appEnv) {
		this.appEnv = appEnv

		return this
	}

	getWorkerUrl(ressources = '', params = {}) {
		const host = process.env.ZENATON_WORKER_URL ? process.env.ZENATON_WORKER_URL : ZENATON_WORKER_URL
		const port = process.env.ZENATON_WORKER_PORT ? process.env.ZENATON_WORKER_PORT : DEFAULT_WORKER_PORT
		const path = `/api/${WORKER_API_VERSION}/${ressources}`
		const queryString = this.getQueryString(Object.assign(
			{},
			params,
			this.getAppEnv()
		))

		const url = `${host}:${port}${path}?${queryString}`
		return url
	}

	getWebsiteUrl(ressources = '', params = {}) {
		const host = process.env.ZENATON_API_URL ? process.env.ZENATON_API_URL : ZENATON_API_URL
		const path = `/${ressources}`
		const queryString = this.getQueryString(Object.assign(
			{ [API_TOKEN]: this.apiToken },
			params,
			this.getAppEnv()
		))

		const url = `${host}${path}?${queryString}`
		return url
	}

	/**
     * Start a workflow instance
     */
	startWorkflow(flow) {
		// custom id management
		let customId = null
		if ('function' === typeof flow.id) {
			// customId can be a value or a function
			customId = flow.id()
			// customId should be a string or a number
			if (('string' !== typeof customId) && ('number' !== typeof customId)) {
				throw new InvalidArgumentError('Provided id must be a string or a number - current type: ' + (typeof customId))
			}
			// at the end, it's a string
			customId = customId.toString()
			// should be not more than 256 bytes;
			if (customId.length >= MAX_ID_SIZE) {
				throw new ExternalZenatonError('Provided id must not exceed ' + MAX_ID_SIZE + ' bytes')
			}
		}

		// start workflow
		const body = {
			[ATTR_PROG]: PROG,
			[ATTR_CANONICAL]: flow._getCanonical(),
			[ATTR_NAME]: flow.name,
			[ATTR_DATA]: serializer.encode(flow.data),
			[ATTR_ID]: customId
		}

		return http.post(this.getInstanceWorkerUrl(), body)
	}

	/**
     * Kill a workflow instance
     */
	killWorkflow(workflowName, customId) {
		return this.updateInstance(workflowName, customId, WORKFLOW_KILL)
	}

	/**
     * Pause a workflow instance
     */
	pauseWorkflow(workflowName, customId) {
		return this.updateInstance(workflowName, customId, WORKFLOW_PAUSE)
	}

	/**
     * Resume a workflow instance
     */
	resumeWorkflow(workflowName, customId) {
		return this.updateInstance(workflowName, customId, WORKFLOW_RUN)
	}

	/**
     * Find a workflow instance
     */
	findWorkflow(workflowName, customId) {
		const params = {
			[ATTR_ID]: customId,
			[ATTR_NAME]: workflowName,
			[ATTR_PROG]: PROG
		}

		return http.get(this.getInstanceWebsiteUrl(params))
			.then( body => {
				return workflowManager.getWorkflow(workflowName, body.data.properties)
			})
	}

	/**
     * Send an event to a workflow instance
     */
	sendEvent(workflowName, customId, eventName, eventData) {
		const url = this.getSendEventURL()

		const body = {
			[ATTR_PROG]: PROG,
			[ATTR_NAME]: workflowName,
			[ATTR_ID]: customId,
			[EVENT_NAME]: eventName,
			[EVENT_INPUT]: serializer.encode(eventData)
		}

		return http.post(url, body)
	}


	updateInstance(workflowName, customId, mode) {
		const params = {
			[ATTR_ID]: customId,
		}

		const body = {
			[ATTR_PROG]: PROG,
			[ATTR_NAME]: workflowName,
			[ATTR_MODE]: mode
		}

		return http.put(this.getInstanceWorkerUrl(params), body)
	}

	getInstanceWebsiteUrl(params = {}) {
		return this.getWebsiteUrl('instances', params)
	}

	getInstanceWorkerUrl(params = {}) {
		return this.getWorkerUrl('instances', params)
	}

	getSendEventURL() {
		return this.getWorkerUrl('events')
	}

	getAppEnv() {
		// when called from worker, APP_ENV and APP_ID is not defined
		const params = {}

		if (this.appEnv) {
			params[APP_ENV] = this.appEnv
		}

		if (this.appId) {
			params[APP_ID] = this.appId
		}

		return params
	}

	getQueryString(params) {
		return Object.keys(params).map(key =>
			`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
		).join('&')
	}
}
