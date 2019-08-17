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

  check(name) {
    const TaskClass = this.getClass(name);
    if (undefined === TaskClass) {
      throw new ExternalZenatonError(
        `Unknown task "${name}", please add it to your --boot file`,
      );
    }
    return TaskClass;
  }

  setClass(name, task) {
    if (undefined !== this.getClass(name)) {
      throw new ExternalZenatonError(`"Task ${name}" can not be defined twice`);
    }
    this.tasks[name] = task;
  }

  getClass(name) {
    return this.tasks[name];
  }

  getTask(name) {
    const TaskClass = this.check(name);
    return new TaskClass();
  }
};

module.exports = new TaskManager();
