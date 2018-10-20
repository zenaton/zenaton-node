const serializer = require("../Services/Serializer");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");

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
    const taskClass = this.getClass(name);
    // do not use construct function to set data
    taskClass._useInit = false;
    // get new task instance
    const task = new taskClass(data);
    // avoid side effect
    taskClass._useInit = true;
    // return task
    return task;
  }
};

module.exports = new TaskManager();
