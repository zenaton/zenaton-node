import _ from 'lodash';
import { ExternalTaskyException, objectsHaveSameKeys } from '../Common/index';

let instance = null;

export default class Workflow {
    constructor(workflow) {
        if (instance) {
            return instance;
        }

        this.workflow = workflow;

        _.each(this.properties(), (p, k ) => {
            this.workflow[k] = p;
        })
        instance = this;
    }

    properties() {
        return this.workflow.properties();
    }

    setProperties(properties) {
        const actualProperties = this.properties();

        if ( ! ( objectsHaveSameKeys(actualProperties, properties) ) ) {
            throw new ExternalTaskyException('The data sent must match the properties of the Workflow Object')
        }

        this.workflow.properties = () => properties;
        _.each(properties, (p, k ) => {
            this.workflow[k] = p
        });

    }

    handle() {
        return this.workflow.handle()
    }

    name() {
        return this.workflow.name;
    }
    id() {
        return this.workflow.id();
    }


}
