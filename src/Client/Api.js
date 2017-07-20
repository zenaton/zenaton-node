/* Singleton Class
  * Setting up block level variable to store class state
  * , set's to null by default.
*/
import { get, post, put } from '../Common/Services';
import { ExternalZenatonException } from '../Common/Exceptions';

let instance = null;

const ZENATON_URL = 'https://zenaton.com/api';
const APP_ENV = 'app_env';
const APP_ID = 'app_id';
const API_TOKEN = 'api_token';

const NAME = 'name';
const VERSION = 'version';
const DATA = 'data';
const CUSTOM_ID = 'custom_id';
const STATE = 'state';
const PROGRAMMING_LANGUAGE = 'programming_language';

export default class Api {
    constructor() {
        if (instance) {
            return instance;
        }

        instance = this;
    }

    init(appId, apiToken, appEnv) {
        this.appId = appId;
        this.apiToken = apiToken;
        this.appEnv = appEnv;

        return this;
    }

    startWorkflow(name, data, customId) {

        const body = {};
        body[NAME] = name;
        body[DATA] = JSON.stringify(data);
        body[CUSTOM_ID] = customId;
        body[PROGRAMMING_LANGUAGE] = 'Javascript';

        return post(this.getStartWorkflowURL(), body)
    }

    sendEvent(customId, workflowName, name, input) {
        const url = this.getSendEventURL();

        const body = {
            custom_id: customId,
            event_input: JSON.stringify(input),
            event_name: name,
            name: workflowName,
            programming_language: 'Javascript'
        };

        return post(url, body);
    }

    getStartWorkflowURL() {
        return this.addIdentification(`${ZENATON_URL}/instances`);
    }

    getSendEventURL() {
        return this.addIdentification(`${ZENATON_URL}/events`);
    }

    addIdentification(url, params = '') {
        return `${url}?${APP_ENV}=${this.appEnv}&${APP_ID}=${this.appId}&${API_TOKEN}=${this.apiToken}&${params}`;
    }
}
