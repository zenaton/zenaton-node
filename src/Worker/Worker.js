import Microserver from './Microserver';
import Task from './Task';
import TaskManager from './TaskManager';


export default class Workfer {
    constructor(uuid, name, input, hash) {
        this.microserver = (new Microserver()).setUuid(uuid).setHash(hash);
        this.taskManager = new TaskManager();
        this.task = this.taskManager.init(name, input);
    }

    process() {
        let output;
        try {
            console.log(output);
            output = this.task.handle();
        } catch (e) {

        }
        this.microserver.completeWork(output);
        this.microserver.reset();
    }
}
