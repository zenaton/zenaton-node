import Api from './Api';
import { Workflow as W } from '../Worker';
export default class Workflow {
    constructor() {
        // Singleton
        this.api = new Api();
    }

    getId() {
        return this.id;
    }

    start(flow, data) {
        if (flow instanceof W ) {
            console.log('respect');
        } else {
            console.log('no respect');

        }
    }
}
