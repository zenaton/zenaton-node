const { InvalidArgumentError } = require("../../Errors");
const taskManager = require("./TaskManager");

const task = function task(name, definition) {
  const reservedMethods = [
    "handle",
    "maxProcessingTime",
    "onFailureRetryDelay",
  ];

  if (typeof name !== "string") {
    throw new InvalidArgumentError(
      "When creating a task, 1st parameter (task name) must be a string",
    );
  }

  // check task definition
  if (typeof definition !== "function" && typeof definition !== "object") {
    throw new InvalidArgumentError(
      `When creating "${name}", 2nd parameter (task definition) must be a function or an object`,
    );
  }
  if (typeof definition === "object") {
    if (undefined === definition.handle) {
      throw new InvalidArgumentError(
        `When creating "${name}", 2nd parameter (task definition) must have a "handle" method`,
      );
    }
    Object.keys(definition).forEach((method) => {
      if (typeof definition[method] !== "function") {
        throw new InvalidArgumentError(
          `When creating "${name}", methods must be function - check value of "${method}"`,
        );
      }
      if (reservedMethods.indexOf(method) < 0) {
        // reserved method
        throw new InvalidArgumentError(
          `When creating "${name}", allowed methods are "${reservedMethods}", check "${method}"`,
        );
      }
    });
  }

  const TaskClass = class TaskClass {
    constructor() {
      this.data = {};

      // set and bind instance methods
      if (typeof definition === "function") {
        this.handle = definition.bind(this.data);
      } else {
        const that = this;

        Object.keys(definition).forEach((method) => {
          that[method] = definition[method].bind(that.data);
        });
      }
    }
  };

  // define name of this class
  Object.defineProperty(TaskClass, "name", { value: name });

  // register this new task
  taskManager.set(name, TaskClass);

  return TaskClass;
};

module.exports = task;
