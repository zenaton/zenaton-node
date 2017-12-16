import TaskManager from './TaskManager';

module.exports = function Task(name, handle) {

    // check that task has the right format

    const task = class {
        constructor(data) {
            this.name = name;
            this.data = data;

            // ensure handle function is called
            // with right context
            let binded = handle.bind(this);

            let promiseHandle = function () {
                return new Promise(function (resolve, reject) {
                    // call handle with custom done function
                    binded(function(err, data) {
                        if (err) return reject(err);
                        resolve(data);
                    });
                });
            };

            this.handle = handle;

            this.execute = promiseHandle;

            this.dispatch = promiseHandle;
        }
    };

    const taskManager = new TaskManager();
    taskManager.setTask(name, task);

    return task;
}
