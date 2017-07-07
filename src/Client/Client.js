import Api from './Api';
import Workflow from './Workflow';

class Client {
    constructor(appId, apiToken, appEnv) {
        new Api().init(appId, apiToken, appEnv);
        this.workflow = new Workflow();
    }

    start(flow, data) {
        return this.workflow.start(flow, data);
    }

    find(className) {
        this.className = className;

        return this;
    }

    byId(customId) {
        return this.workflow.setInstance(customId, this.className);
    }
}

module.exports = Client;
