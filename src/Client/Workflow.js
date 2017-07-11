import Api from './Api';
import { ExternalZenatonException } from '../Common/index';
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
        
        this.api.startWorkflow(this.workflowName, flow.getData(), (customId) || null)
            .then((response) => {
                console.log(response);
                if (response.error) {
                    throw new ExternalZenatonException(response.error);
                }
                this.id = response.custom_id
            })
            .catch((error) => {
                console.log(error);
                throw new ExternalZenatonException(error);
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

    getData() {

    }


}
