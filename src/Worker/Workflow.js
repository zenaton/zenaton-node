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

        _.each(this.props(), (p) => {
            this.workflow.data[p] = null;
        });

        workflowManager.setWorkflow(this);

        const dataSetter = (data = null) => {
            if (data) {
                this.setData(data);
            }
            return this;
        }

        return dataSetter;
    }

    props() {
        return this.workflow.props;
    }

    setData(data) {

        if ( ! ( objectsHaveSameKeys(this.workflow.data, data) ) ) {
            throw new ExternalZenatonException('The data sent must match the properties of the Workflow Object')
        }

        _.each(data, (p, k ) => {
            this.workflow.data[k] = p;
            this.workflow[k] = p;
        });
    }

    getData() {
        return this.workflow.data;
    }

    init(name, data, event) {
        // select the good workflow with the name
        // const workflow = this.workflowManager.getWorkflow(name)

        // console.log(workflow);
        // // Build the properties
        // this.setData(JSON.parse(data));

        // // build event
        // $this->event = $event ? $this->jsonizer->decode(
        //     $event,
        //     EventInterface::class
        //   ) : null;

        // // init position
        this.position.init();

        return this;
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


}
