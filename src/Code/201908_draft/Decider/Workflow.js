const { InvalidArgumentError, ZenatonError } = require("../../../Errors");
const workflowManager = require("./WorkflowManager");
const Dispatch = require("../Client/Dispatch");
const Execute = require("./Execute");
const Wait = require("./Wait");
const ProcessorInterface = require("./ProcessorInterface");
const Interface = require("../Services/Interface");
const WorkflowContext = require("./WorkflowContext");

const workflow = function workflow(name, definition) {
  // check that provided data have the right format
  if (typeof name !== "string" || name.length === 0) {
    throw new InvalidArgumentError(
      "When getting or creating a workflow, 1st parameter (workflow name) must be a non-empty string",
    );
  }
  //  workflow getter
  if (typeof definition === "undefined") {
    return workflowManager.get(name);
  }
  // check workflow definition
  if (typeof definition !== "function" && typeof definition !== "object") {
    throw new InvalidArgumentError(
      `When creating worflow "${name}", 2nd parameter (workflow definition) must be a function or an object`,
    );
  }
  if (typeof definition === "object") {
    if (definition.handle === undefined) {
      throw new InvalidArgumentError(
        `When creating worflow "${name}", 2nd parameter (workflow definition) must have a "handle" method`,
      );
    }
    const reservedMethods = ["handle"];
    Object.keys(definition).forEach((method) => {
      if (
        reservedMethods.indexOf(method) >= 0 &&
        typeof definition[method] !== "function"
      ) {
        throw new InvalidArgumentError(
          `When creating workflow "${name}",  "${method}" method must be a function, not a "${typeof definition[
            method
          ]}"`,
        );
      }
    });
  }

  const _dispatch = new Dispatch();
  const _execute = new Execute();
  const _wait = new Wait();

  const WorkflowClass = class WorkflowClass {
    get properties() {
      const properties = {};
      Object.keys(this).forEach((prop) => {
        if (prop !== "_context") {
          properties[prop] = this[prop];
        }
      });
      return properties;
    }

    set properties(properties) {
      // delete existing values
      Object.keys(this).forEach((prop) => delete this[prop]);
      // fill with new values
      Object.assign(this, properties);
      return this;
    }

    get context() {
      if (this._context === undefined) {
        return new WorkflowContext();
      }

      return this._context;
    }

    set context(context) {
      if (this._context !== undefined) {
        throw new ZenatonError("Context is already set and cannot be mutated.");
      }
      this._context = context;
    }

    set processor(processor) {
      Interface.check(processor, ProcessorInterface);
      _dispatch.processor = processor;
      _execute.processor = processor;
      _wait.processor = processor;
    }
  };

  // set class name
  Object.defineProperty(WorkflowClass, "name", { value: name });

  // reserved dispatch methods
  Object.defineProperty(WorkflowClass.prototype, "dispatch", {
    value: _dispatch,
    writable: false,
    configurable: false,
  });

  // reserved execute methods
  Object.defineProperty(WorkflowClass.prototype, "execute", {
    value: _execute,
    writable: false,
    configurable: false,
  });

  // reserved wait methods
  Object.defineProperty(WorkflowClass.prototype, "wait", {
    value: _wait,
    writable: false,
    configurable: false,
  });

  // user-defined methods
  if (typeof definition === "function") {
    WorkflowClass.prototype.handle = definition;
  } else {
    Object.keys(definition).forEach((method) => {
      WorkflowClass.prototype[method] = definition[method];
    });
  }

  // register it in our workflow manager
  workflowManager.add(name, WorkflowClass);

  return WorkflowClass;
};

module.exports = workflow;
