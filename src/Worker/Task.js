let instance = null;
import { ExternalZenatonException, objectsHaveSameKeys } from '../Common/index';

export default class Task {

    constructor(task) {
        if (instance) {
            return instance
        }

        this.task = task;
        instance = this;
    }

    setData(data) {
        const actualData = this.data();

        if ( ! ( objectsHaveSameKeys(actualData, data) ) ) {
            throw new ExternalZenatonException('The data sent must match the properties of the Task Object')
        }

        this.data.data = () => data;
        _.each(data, (p, k ) => {
            this.task[k] = p
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

    data() {
        return this.task.data();
    }

    handle() {
        return this.task.handle();
    }

    timeout() {
        return this.task.timeout();
    }
}
