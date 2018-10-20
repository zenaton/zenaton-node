const AbstractTask = require("./AbstractTask");
const taskManager = require("./TaskManager");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");

module.exports = function(name, task) {
  if (typeof name !== "string") {
    throw new InvalidArgumentError(
      "1st parameter (task name) must be a string",
    );
  }

  // task getter
  if (undefined === task) {
    return taskManager.getClass(name);
  }

  // check task definition
  if (typeof task !== "function" && typeof task !== "object") {
    throw new InvalidArgumentError(
      "2nd parameter (task implemention) must be an function or an object ",
    );
  }
  if (typeof task === "object") {
    if (undefined === task.handle) {
      throw new InvalidArgumentError('Your task MUST define a "handle" method');
    }
    if (undefined !== task._promiseHandle) {
      throw new InvalidArgumentError(
        'Your task can NOT redefine a "_promiseHandle" method',
      );
    }
    Object.keys(task).forEach((method) => {
      if (typeof task[method] !== "function") {
        throw new InvalidArgumentError(
          `Task's methods must be functions - check value of "${method}"`,
        );
      }
    });
  }

  let _useInit = true;

  const TaskClass = class extends AbstractTask {
    constructor(...data) {
      super(name);

      // if this task defined by a simple function?
      const isFn = typeof task === "function";

      // set instance data
      if (_useInit === false || isFn || undefined === task.init) {
        this.data = data[0];
      } else {
        this.data = {};
        task.init.bind(this.data)(...data);
      }

      const that = this;
      // set and bind instance methods
      if (isFn) {
        this.handle = task.bind(this.data);
      } else {
        Object.keys(task).forEach((method) => {
          if (method !== "init") {
            if (AbstractTask.methods().indexOf(method) < 0) {
              // private method
              if (undefined !== that.data[method]) {
                throw new InvalidArgumentError(
                  `"${method}" is defined more than once in "${name}" task`,
                );
              }
              that.data[method] = task[method].bind(that.data);
            } else {
              // zenaton method
              that[method] = task[method].bind(that.data);
            }
          }
        });
      }
      // special handle method returning a promise
      this._promiseHandle = function() {
        return new Promise((resolve, reject) => {
          that.handle((err, data) => {
            if (err) return reject(err);
            resolve(data);
          });
        });
      };
    }

    /**
     * static methods used to tell class to
     * not use construct method to inject data
     */
    static get _useInit() {
      return _useInit;
    }

    static set _useInit(value) {
      _useInit = value;
    }
  };

  // define name of this class
  Object.defineProperty(TaskClass, "name", { value: name });

  // store this fonction in a singleton to retrieve it later
  taskManager.setClass(name, TaskClass);

  return TaskClass;
};
