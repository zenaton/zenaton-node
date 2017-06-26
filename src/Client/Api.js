/* Singleton Class
  * Setting up block level variable to store class state
  * , set's to null by default.
*/
import { get, post, put } from '../Services/Http';

let instance = null;

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

    startWorkflow() {
        
    }
}
