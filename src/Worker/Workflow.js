import _ from 'lodash';
import { ExternalZenatonException } from '../Common/Exceptions';
import WorkflowManager from './WorkflowManager';
import Position from './Position';


export default class Workflow {
    constructor(workflow = null) {

        const workflowManager = new WorkflowManager();

        this.workflow = workflow;
        this.workflow.data = {};

        this.position = new Position();

        workflowManager.setWorkflow(this);

        const dataSetter = (data = null) => {
            if (data) {
                this.setData(data);
            }
            return this;
        }

        return dataSetter;
    }

    setData(data) {

        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        _.each(data, (p, k ) => {
            this.workflow.data[k] = p;
            this.workflow[k] = p;
        });
    }

    getData() {
        return this.workflow.data;
    }


    setEvent(event) {
        this.workflow.event = event;
    }

    handle() {
        if (!this.workflow.event) {
            return this.workflow.handle()
        }

        if (typeof this.workflow.onEvent === 'function') {
            this.workflow.onEvent(this.workflow.event)

            return;
        }
    }

    name() {
        return this.workflow.name;
    }

    id() {

        if (typeof this.workflow.id === 'function') {
            return this.workflow.id();
        }
    }

    getPosition() {
        return this.position.get();
    }

    next() {
        this.position.next();
    }

    nextParallel() {
        this.position.nextParallel();
    }

    nextAsync() {
        this.position.nextAsync();
    }
}
