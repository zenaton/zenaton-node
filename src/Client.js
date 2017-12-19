const ExternalZenatonException = require('./Exceptions/ExternalZenatonException')
const InvalidArgumentException = require('./Exceptions/InvalidArgumentException')
const http = require('./Services/Http')

const MAX_ID_SIZE = 256

const ZENATON_API_URL = 'https://zenaton.com/api/v1'
const ZENATON_WORKER_URL = 'http://localhost:'
const DEFAULT_WORKER_PORT = 4001
const WORKER_API_VERSION = 'v_newton'

const APP_ENV = 'app_env'
const APP_ID = 'app_id'
const API_TOKEN = 'api_token'

const ATTR_NAME = 'name'
const ATTR_DATA = 'data'
const ATTR_ID = 'custom_id'
const ATTR_PROG = 'programming_language'
const ATTR_CANONICAL = 'canonical_name'

const EVENT_INPUT = 'event_input'
const EVENT_NAME = 'event_name'

const WORKFLOW_KILL = 'kill'
const WORKFLOW_PAUSE = 'pause'
const WORKFLOW_RUN = 'run'

let instance

export default class Client {

	constructor(appId, apiToken, appEnv) {
		if (instance) {
			if (! instance.appId || ! instance.apiToken || ! instance.appEnv) {
				throw new ExternalZenatonException('Please initialize your Zenaton client with your credentials')
			}
			return instance
		}
		instance = this
		// store credentials in singleton
		this.appId = appId
		this.apiToken = apiToken
		this.appEnv = appEnv
	}

	startWorkflow(flow) {
		let id
		if (flow.getId !== undefined) {
			// id can be a value or a function
			id = flow.getId()
			// id should be a string or a number
			if (('string' !== typeof id) && ('number' !== typeof id)) {
				throw new InvalidArgumentException('Provided id must be a string or a number')
			}
			// at the end, it's a string
			id = id.toString()
			// should be not more than 256 bytes;
			if (id.length >= MAX_ID_SIZE) {
				throw new ExternalZenatonException('Provided id is too long - must not exceed ' + MAX_ID_SIZE + ' bytes')
			}
		}

		const body = {}
		body[ATTR_NAME] = flow.name,
		body[ATTR_CANONICAL] = null
		body[ATTR_DATA] = JSON.stringify(flow.data)
		body[ATTR_ID] = id || null,
		body[ATTR_PROG] = 'Javascript'

		http.post(this.getInstanceWorkerUrl(), body)

		return
	}

	// /**
	//      * Kill a workflow instance
	//      *
	//      * @param  String  $workflowName Workflow class name
	//      * @param  String  $customId     Provided custom id
	//      * @return void
	//      */
	//     public function killWorkflow($workflowName, $customId)
	//     {
	//         $this->updateInstance($workflowName, $customId, self::WORKFLOW_KILL);
	//     }
	//
	//     /**
	//      * Pause a workflow instance
	//      *
	//      * @param  String  $workflowName Workflow class name
	//      * @param  String  $customId     Provided custom id
	//      * @return void
	//      */
	//     public function pauseWorkflow($workflowName, $customId)
	//     {
	//         $this->updateInstance($workflowName, $customId, self::WORKFLOW_PAUSE);
	//     }
	//
	//     /**
	//      * Resume a workflow instance
	//      *
	//      * @param  String  $workflowName Workflow class name
	//      * @param  String  $customId     Provided custom id
	//      * @return void
	//      */
	//     public function resumeWorkflow($workflowName, $customId)
	//     {
	//         $this->updateInstance($workflowName, $customId, self::WORKFLOW_RUN);
	//     }
	//
	//     /**
	//      * Find a workflow instance
	//      *
	//      * @param  String  $workflowName Workflow class name
	//      * @param  String  $customId     Provided custom id
	//      * @return Zenaton\Interfaces\WorkflowInterface
	//      */
	//     public function findWorkflow($workflowName, $customId)
	//     {
	//         $properties = $this->getWorkflowProperties($workflowName, $customId);
	//
	//         return $this->properties->getObjectFromNameAndProperties($workflowName, $properties);
	//     }
	//
	//     /**
	//      * Send an event to a workflow instance
	//      *
	//      * @param  String  $workflowName Workflow class name
	//      * @param  String  $customId     Provided custom id
	//      * @param  Zenaton\Interfaces\EventInterface $event Event to send
	//      * @return void
	//      */
	//     public function sendEvent($workflowName, $customId, EventInterface $event)
	//     {
	//         $url = $this->getSendEventURL();
	//
	//         $body = [
	//             self::NAME => $workflowName,
	//             self::CUSTOM_ID => $customId,
	//             self::EVENT_NAME => get_class($event),
	//             self::EVENT_INPUT => $this->serializer->encode($this->properties->getFromObject($event)),
	//             self::PROGRAMMING_LANGUAGE => self::PHP,
	//         ];
	//
	//         $this->http->post($url, $body);
	//     }
	//
	//     protected function updateInstance($workflowName, $customId, $mode)
	//     {
	//         $params = self::CUSTOM_ID.'='.$customId;
	//         return $this->http->put($this->getInstanceWorkerUrl($params), [
	//             self::NAME => $workflowName,
	//             self::PROGRAMMING_LANGUAGE => self::PHP,
	//             self::MODE => $mode,
	//         ]);
	//     }
	//
	//     protected function getWorkflowProperties($workflowName, $customId)
	//     {
	//         $params = self::CUSTOM_ID.'='.$customId.'&'.self::NAME.'='.$workflowName.'&'.self::PROGRAMMING_LANGUAGE.'='.self::PHP;
	//
	//         $encoded = $this->http->get($this->getInstanceZenatonUrl($params));
	//
	//         return $this->serializer->decode($encoded->data->properties);
	//     }

	getZenatonUrl()
	{
		return (process.env.ZENATON_API_URL) ?  process.env.ZENATON_API_URL : ZENATON_API_URL
	}

	getWorkerUrl()
	{
		let url = ZENATON_WORKER_URL + (process.env.ZENATON_WORKER_PORT ?  process.env.ZENATON_WORKER_PORT : DEFAULT_WORKER_PORT)
		return url + '/api/' + WORKER_API_VERSION
	}

	getInstanceZenatonUrl(params = '') {
		return this.addIdentification(`${this.getZenatonUrl()}/instances`, params)
	}

	getInstanceWorkerUrl(params = '') {
		return this.addIdentification(`${this.getWorkerUrl()}/instances`, params)
	}

	getSendEventURL() {
		return this.addIdentification(`${this.getWorkerUrl()}/events`)
	}

	addIdentification(url, params = '') {
		return `${url}?${APP_ENV}=${this.appEnv}&${APP_ID}=${this.appId}&${API_TOKEN}=${this.apiToken}&${params}`
	}
}
