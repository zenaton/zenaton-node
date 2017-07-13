import Microserver from './Microserver';
import Task from './Task';
import TaskManager from './TaskManager';


export default class Worker {
    constructor(uuid, name, input, hash) {
        this.microserver = (new Microserver()).setUuid(uuid).setHash(hash);
        this.taskManager = new TaskManager();
        this.task = this.taskManager.init(name, input);
    }

    process() {
        try {
            this.task.handle(this.done.bind(this));
        } catch (e) {

        }

    }

    done(error = null, output = null) {
        this.microserver.completeWork(output);
        this.microserver.reset();
    }
}
