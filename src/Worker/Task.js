let instance = null;

export default class Task {

    constructor(task) {
        if (instance) {
            return instance
        }

        this.task = task;
        instance = this;
    }

    handle() {
        return this.task.handle();
    }

    timeout() {
        return this.task.timeout();
    }
}

const SendWelcomeEmail = new Task({
    handle(data, done) {
        // ...
    },
    timeout(){
        return 20;
    }
});

const SendWelcomeEmail1 = new Task({
    handle(data, done) {
        // ...
    },
    timeout(){
        return 20;
    }
});
