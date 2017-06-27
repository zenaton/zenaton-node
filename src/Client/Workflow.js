import Api from './Api';
import { ExternalTaskyException } from '../Common/index';
import { Workflow as W } from '../Worker/index';

const SIZE_OF_VARCHAR = 191;

export default class Workflow {
    constructor() {
        // Singleton
        this.api = new Api();
    }

    getId() {
        return this.id;
    }

    start(flow, data) {
        let customId;

        if ( !(flow instanceof W) ) {
            throw new ExternalTaskyException('First Argument must be an instance of Workflow ');
        }

        if (! flow.name()) {
            throw new ExternalTaskyException('You need to set a Name argument to your workflow ');
        }

        this.workflowName = flow.name();

        flow.setProperties(data);

        const properties = flow.properties();
        if (flow.id()) {
            customId = flow.id();

            if (customId.length >= SIZE_OF_VARCHAR) {
                throw new ExternalTaskyException('The ID provided must not exceed 191 characters');
            }
        }

        this.api.startWorkflow(this.workflowName, properties, (customId) || null)
            .then((response) => {
                this.id = response.custom_id
            })
            .catch((error) => {
                throw new ExternalTaskyException(error);
            });

        return this;
    }

    sendEvent() {
        
    }

    kill() {
    }

    pause() {

    }

    resume() {

    }

    getProperties() {

    }


}
