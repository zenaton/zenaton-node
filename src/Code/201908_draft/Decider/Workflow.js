const { InvalidArgumentError } = require("../../../Errors");
const workflowManager = require("./WorkflowManager");
const Dispatch = require("../Client/Dispatch");
const Execute = require("./Execute");
const Wait = require("./Wait");
const ProcessorInterface = require("./ProcessorInterface");
const Interface = require("../Services/Interface");

const workflow = function workflow(name, definition) {
  // check that provided data have the right format
  if (typeof name !== "string" || name.length === 0) {
    throw new InvalidArgumentError(
      "When getting or creating a workflow, 1st parameter (workflow name) must be a non-empty string",
    );
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

  const WorkflowClass = class WorkflowClass {
    get _properties() {
      const properties = {};
      Object.keys(this).forEach((prop) => {
        properties[prop] = this[prop];
      });
      return properties;
    }

    set _properties(properties) {
      // delete existing values
      Object.keys(this).forEach((prop) => delete this[prop]);
      // fill with new values
      Object.assign(this, properties);
      return this;
    }

    static set processor(processor) {
      Interface.check(processor, ProcessorInterface);
      _dispatch.processor = processor;
      _execute.processor = processor;
      _wait.processor = processor;
    }
  };

  // set class name
  Object.defineProperty(WorkflowClass, "name", { value: name });

  // reserved dispatch methods
  const _dispatch = new Dispatch();
  Object.defineProperty(WorkflowClass.prototype, "dispatch", {
    value: _dispatch,
    writable: false,
    configurable: false,
  });

  // reserved execute methods
  const _execute = new Execute();
  Object.defineProperty(WorkflowClass.prototype, "execute", {
    value: _execute,
    writable: false,
    configurable: false,
  });

  // reserved wait methods
  const _wait = new Wait();
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
  workflowManager.setClass(name, WorkflowClass);

  return WorkflowClass;
};

module.exports = workflow;
