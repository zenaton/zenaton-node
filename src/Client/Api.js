/* Singleton Class
  * Setting up block level variable to store class state
  * , set's to null by default.
*/
import { get, post, put } from '../Common/Services/index';
import { ExternalZenatonException } from '../Common/index';

let instance = null;

const ZENATON_URL = 'http://website.dev/api';
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

        return new Promise((resolve, reject) => {
            post(this.getStartWorkflowURL(), body)
                .then((response) => {
                     resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })

    }

    getStartWorkflowURL() {
        return this.addIdentification(`${ZENATON_URL}/instances`);
    }

    addIdentification(url, params = '') {
        return `${url}?${APP_ENV}=${this.appEnv}&${APP_ID}=${this.appId}&${API_TOKEN}=${this.apiToken}&${params}`;
    }
}
