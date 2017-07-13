import _ from 'lodash';
import { ExternalZenatonException, objectsHaveSameKeys } from '../Common/index';
import WorkflowManager from './WorkflowManager';
import Position from './Position';

export default class Workflow {
    constructor(workflow = null) {

        const workflowManager = new WorkflowManager();

        this.workflow = workflow;
        this.workflow.data = {};

        this.position = new Position();

        // _.each(this.props(), (p) => {
        //     this.workflow.data[p] = null;
        // });

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

    handle() {
        return this.workflow.handle()
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
