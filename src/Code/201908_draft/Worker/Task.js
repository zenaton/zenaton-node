const { ExternalZenatonError } = require("../../../Errors");
const taskManager = require("./TaskManager");
const Run = require("../Client/Run");
const Select = require("../Client/Select");
const Schedule = require("../Client/Schedule");
const objectify = require("../Services/Objectify");

const task = function task(name, definition) {
  // check that provided data have the right format
  if (typeof name !== "string" || name.length === 0) {
    throw new ExternalZenatonError(
      "When getting or creating a task, 1st parameter (task name) must be a non-empty string",
    );
  }
  //  task getter
  if (typeof definition === "undefined") {
    return taskManager.get(name);
  }
  // check task definition
  if (typeof definition !== "function" && typeof definition !== "object") {
    throw new ExternalZenatonError(
      `When creating "${name}", 2nd parameter (task definition) must be a function or an object`,
    );
  }
  if (typeof definition === "object") {
    if (undefined === definition.handle) {
      throw new ExternalZenatonError(
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
        throw new ExternalZenatonError(
          `When creating task "${name}",  "${method}" method must be a function, not a "${typeof definition[
            method
          ]}"`,
        );
      }
    });
  }

  const TaskClass = class TaskClass {
    set processor(processor) {
      this._processor = processor;
    }

    get context() {
      return this._context;
    }

    set context(context) {
      if (this._context !== undefined) {
        throw new ExternalZenatonError(
          "Context is already set and cannot be mutated.",
        );
      }
      this._context = context;
    }

    get run() {
      return objectify(Run, this._processor);
    }

    get select() {
      return objectify(Select, this._processor);
    }

    get schedule() {
      return objectify(Schedule, this._processor);
    }

    set run(_d) {
      throw new ExternalZenatonError(
        'Sorry, "run" is reserved and can not be mutated',
      );
    }

    set select(_s) {
      throw new ExternalZenatonError(
        'Sorry, "select" is reserved and can not be mutated',
      );
    }

    set schedule(_s) {
      throw new ExternalZenatonError(
        'Sorry, "schedule" is reserved and can not be mutated',
      );
    }
  };

  // define name of this class
  Object.defineProperty(TaskClass, "name", { value: name });

  // user-defined methods
  if (typeof definition === "function") {
    TaskClass.prototype.handle = definition;
  } else {
    Object.keys(definition).forEach((method) => {
      TaskClass.prototype[method] = definition[method];
    });
  }

  // register it in our task manager
  taskManager.add(name, TaskClass);

  return TaskClass;
};

module.exports = task;
