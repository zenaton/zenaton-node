import Microserver from './Microserver';

let instance = null;

export default class Helpers {
    constructor() {
        if (instance) {
            return instance
        }

        this.microserver = new Microserver();
        instance = this;
    }

    doExecute(boxes, isSync) {

    }
}
