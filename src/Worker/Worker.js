import Microserver from './Microserver';
import Task from './Task';

export default class Workfer {
    constructor(uuid, name, input, hash) {
        this.microserver = (new Microserver()).setUuid(uuid).setHash(hash);
        this.task = (new Task()).init(name, input)
    }

    process() {

    }
}
