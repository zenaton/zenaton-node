const { serializer } = require("../Services");
const { InvalidArgumentError } = require("../../Errors");

let instance;

const TaskManager = class {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.tasks = {};
  }

  setClass(name, task) {
    // check that this workflow does not exist yet
    if (undefined !== this.getClass(name)) {
      throw new InvalidArgumentError(`"${name}" task can not be defined twice`);
    }

    this.tasks[name] = task;
  }

  getClass(name) {
    return this.tasks[name];
  }

  getTask(name, encodedData) {
    // unserialize data
    const data = serializer.decode(encodedData);
    // get task class
    const TaskClass = this.getClass(name);
    // do not use construct function to set data
    TaskClass._useInit = false;
    // get new task instance
    const task = new TaskClass(data);
    // avoid side effect
    TaskClass._useInit = true;
    // return task
    return task;
  }
};

module.exports = new TaskManager();
