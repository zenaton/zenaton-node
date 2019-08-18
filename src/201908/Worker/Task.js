const { InvalidArgumentError } = require("../../Errors");
const taskManager = require("./TaskManager");
const Dispatch = require("../Client/Dispatch");
const Select = require("../Client/Select");

const task = function task(name, definition) {
  // check that provided data have the right format
  if (typeof name !== "string" || name.length === 0) {
    throw new InvalidArgumentError(
      "When creating a task, 1st parameter (task name) must be a non-empty string",
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
    const reservedMethods = [
      "handle",
      "maxProcessingTime",
      "onFailureRetryDelay",
    ];
    Object.keys(definition).forEach((method) => {
      if (
        reservedMethods.indexOf(method) >= 0 &&
        typeof definition[method] !== "function"
      ) {
        throw new InvalidArgumentError(
          `When creating task "${name}",  "${method}" method must be a function, not a "${typeof definition[
            method
          ]}"`,
        );
      }
    });
  }

  const TaskClass = class TaskClass {
    static set processor(processor) {
      _dispatch.processor = processor;
      _select.processor = processor;
    }
  };

  // define name of this class
  Object.defineProperty(TaskClass, "name", { value: name });

  // reserved dispatch methods
  const _dispatch = new Dispatch();
  Object.defineProperty(TaskClass.prototype, "dispatch", {
    value: _dispatch,
    writable: false,
    configurable: false,
  });

  // reserved select methods
  const _select = new Select();
  Object.defineProperty(TaskClass.prototype, "select", {
    value: _select,
    writable: false,
    configurable: false,
  });

  // user-defined methods
  if (typeof definition === "function") {
    TaskClass.prototype.handle = definition;
  } else {
    Object.keys(definition).forEach((method) => {
      TaskClass.prototype[method] = definition[method];
    });
  }

  // register it in our task manager
  taskManager.setClass(name, TaskClass);

  return TaskClass;
};

module.exports = task;
