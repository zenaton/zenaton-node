const { ExternalZenatonError } = require("../../Errors");

let instance;

const TaskManager = class {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.tasks = {};
  }

  checkClass(name) {
    const TaskClass = this.getClass(name);
    // check that we know task definition
    if (undefined === TaskClass) {
      throw new ExternalZenatonError(
        `Unknown task "${name}", please add it to your --boot file`,
      );
    }
    return TaskClass;
  }

  setClass(name, task) {
    // check that this workflow does not exist yet
    if (undefined !== this.getClass(name)) {
      throw new ExternalZenatonError(`"Task ${name}" can not be defined twice`);
    }
    this.tasks[name] = task;
  }

  getClass(name) {
    return this.tasks[name];
  }

  getInstance(name) {
    // get Task class
    const TaskClass = this.checkClass(name);
    // return new Task instance
    return new TaskClass();
  }
};

module.exports = new TaskManager();
