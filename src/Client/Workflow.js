import Api from './Api';
import { ExternalZenatonException } from '../Common/Exceptions';
import { Workflow as W } from '../Worker';
import { Event } from '../Worker';

const SIZE_OF_VARCHAR = 191;

export default class Workflow {
    constructor() {
        // Singleton
        this.api = new Api();
    }

    getId() {
        return this.id;
    }

    setInstance(customId, workflowName) {
        this.id = customId;
        this.workflowName = workflowName;
        return this;
    }

    start(flow) {
        let customId;

        if ( !(flow instanceof W) ) {
            throw new ExternalZenatonException('First Argument must be an instance of Workflow ');
        }

        if (! flow.name()) {
            throw new ExternalZenatonException('You need to set a Name argument to your workflow ');
        }
        this.workflowName = flow.name();
        if (flow.id()) {
            customId = flow.id();

            if (customId.length >= SIZE_OF_VARCHAR) {
                throw new ExternalZenatonException('The ID provided must not exceed 191 characters');
            }
        }

        const response = this.api.startWorkflow(this.workflowName, flow.getData(), (customId) || null)

        this.id = response.custom_id

        return this;
    }

    sendEvent(event) {
        if (event instanceof Event) {
            return this.api.sendEvent(
                this.id,
                this.workflowName,
                event.name,
                event
            );
        }

    }

    kill() {
        return this.api.updateInstance(this.id, this.workflowName, 'kill');
    }

    pause() {
        return this.api.updateInstance(this.id, this.workflowName, 'pause');
    }

    resume() {
        return this.api.updateInstance(this.id, this.workflowName, 'run');
    }

    getProperties() {
        const res = this.api.getInstanceDetails(this.id, this.workflowName);
        return JSON.parse(res.instance.properties);
    }


}
