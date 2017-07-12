import _ from 'lodash';
import { ExternalZenatonException, objectsHaveSameKeys } from '../Common/index';

let instance = null;

export default class Task {

    constructor(task) {

        if (instance) {
            return instance
        }

        this.task = task;
        this.task.data = {};

        _.each(this.props(), (p) => {
            this.task.data[p] = null;
        });

        const dataSetter = (data = null) => {
            if (data) {
                this.setData(data);
            }
            instance = this;
            return instance;
        }

        return dataSetter;
    }

    setData(data) {

        if ( ! ( objectsHaveSameKeys(this.task.data, data) ) ) {
            throw new ExternalZenatonException('The data sent must match the properties of the Task Object')
        }

        _.each(data, (p, k ) => {
            this.task.data[k] = p;
            this.task[k] = p;
        });
    }

    init(name, data) {
        // this.task = $this->jsonizer->getObjectFromNameAndEncodedProperties(
        //     $name,
        //     $input,
        //     TaskInterface::class
        // );
        this.setData(JSON.parse(data));

        return this;
    }

    props() {
        return this.task.props;
    }

    handle() {
        return this.task.handle();
    }

    timeout() {
        return this.task.timeout();
    }
}
