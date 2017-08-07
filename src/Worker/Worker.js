import Microserver from './Microserver';
import Task from './Task';
import TaskManager from './TaskManager';
import { ScheduledBoxException, InternalZenatonException, ZenatonException }  from '../Common/Exceptions';


class Worker {
    constructor(uuid, name, input, hash) {
        this.microserver = (new Microserver()).setUuid(uuid).setHash(hash);
        this.taskManager = new TaskManager();
        this.task = this.taskManager.init(name, input);
    }

    process() {
        try {
            this.task.handle(this.done.bind(this));
        } catch (e) {
            if (e instanceof ZenatonException) {
                this.microserver.failWorker(e);
                this.microserver.reset();
                throw e;
            }

            this.microserver.failWork(e);
            this.microserver.reset();
            throw e;
        }

    }

    done(error = null, output = null) {
        if (error) {
            this.microserver.failWork(error)
            this.microserver.reset();
            return;
        }
        this.microserver.completeWork(output);
        this.microserver.reset();
    }
}

module.exports = Worker;
