const AbstractWorkflow = require("./AbstractWorkflow");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const workflowManager = require("./WorkflowManager");
const Builder = require("../Query/Builder");

module.exports = function(name, flow) {
  // check that provided data have the right format
  if (typeof name !== "string") {
    throw new InvalidArgumentError(
      "1st parameter must be a string (workflow name)",
    );
  }

  // workflow getter
  if (undefined === flow) {
    return workflowManager.getClass(name);
  }

  // check definition
  if (typeof flow !== "function" && typeof flow !== "object") {
    throw new InvalidArgumentError(
      "2nd parameter (workflow implemention) must be an function or an object",
    );
  }
  if (typeof flow === "object") {
    if (undefined === flow.handle) {
      throw new InvalidArgumentError(
        'Your workflow MUST define a "handle" method',
      );
    }
    if (undefined !== flow._promiseHandle) {
      throw new InvalidArgumentError(
        'Your workflow can NOT redefine a "_promiseHandle" method',
      );
    }
    AbstractWorkflow.methods().forEach((method) => {
      if (undefined !== flow[method] && typeof flow[method] !== "function") {
        throw new InvalidArgumentError(`"${method}" method must be a function`);
      }
    });
  }

  let _useInit = true;

  // WARNING "WorkflowClass" is used in Version.js, do not change it in isolation
  const WorkflowClass = class extends AbstractWorkflow {
    constructor(...data) {
      super(name);

      // if this workflow defined by a simple function?
      const isFn = typeof flow === "function";

      // set instance data
      if (_useInit === false || isFn || undefined === flow.init) {
        this.data = data.length > 0 ? data[0] : {};
      } else {
        this.data = {};
        flow.init.bind(this.data)(...data);
      }

      const that = this;
      // set and bind instance methods
      if (isFn) {
        this.handle = flow.bind(this.data);
      } else {
        Object.keys(flow).forEach((method) => {
          if (method !== "init") {
            if (AbstractWorkflow.methods().indexOf(method) < 0) {
              // private method
              if (undefined !== that.data[method]) {
                throw new InvalidArgumentError(
                  `"${method}" is defined more than once in "${name}" workflow`,
                );
              }
              that.data[method] = flow[method].bind(that.data);
            } else {
              // zenaton method
              that[method] = flow[method].bind(that.data);
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
     * set canonical name (used by Version)
     */
    _setCanonical(canonical) {
      this.canonical = canonical;

      return this;
    }

    /**
     * get canonical name
     */
    _getCanonical() {
      return this.canonical;
    }

    /**
     * ORM begin
     */
    static whereId(id) {
      return new Builder(name).whereId(id);
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
  Object.defineProperty(WorkflowClass, "name", { value: name });

  // store this fonction in a singleton to retrieve it later
  workflowManager.setClass(name, WorkflowClass);

  return WorkflowClass;
};
