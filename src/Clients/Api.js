/* Singleton Class
  * Setting up block level variable to store class state
  * , set's to null by default.
*/
import dotenv from 'dotenv';
import { get, post, put } from '../Services';
import { ExternalZenatonException } from '../Exceptions';

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

        return post(this.instanceUrl(), body)
    }

    updateInstance(customId, workflowName, mode)
    {

        const params = `custom_id=${customId}`;
        const body = {
            name: workflowName,
            programming_language: 'Javascript',
            mode: mode
        };

        return put(this.instanceUrl(params), body);
    }

    getInstanceDetails(customId, name)
    {   const params = `custom_id=${customId}&name=${name}&programming_language=Javascript`;

        return get(this.instanceUrl(params));
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

    getApiUrl()
    {
        return (process.env.ZENATON_API_URL) ?  process.env.ZENATON_API_URL : ZENATON_URL  ;
    }

    instanceUrl(params = '') {
        return this.addIdentification(`${this.getApiUrl()}/instances`, params);
    }

    getSendEventURL() {
        return this.addIdentification(`${this.getApiUrl()}/events`);
    }

    addIdentification(url, params = '') {
        return `${url}?${APP_ENV}=${this.appEnv}&${APP_ID}=${this.appId}&${API_TOKEN}=${this.apiToken}&${params}`;
    }
}
