import Api from './Api';
import Workflow from './Workflow';

class Client {
    constructor(appId, apiToken, appEnv) {
        new Api().init(appId, apiToken, appEnv);
        this.workflow = new Workflow();
    }

    start(flow) {
        return this.workflow.start(flow);
    }

    find(name) {
        this.name = name;

        return this;
    }

    byId(customId) {
        return this.workflow.setInstance(customId, this.name);
    }
}

module.exports = Client;
