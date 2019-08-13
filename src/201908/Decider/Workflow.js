const { InvalidArgumentError } = require("../../Errors");
const workflowManager = require("./WorkflowManager");
const objectify = require("../Services/Objectify");
const dispatch = objectify(require("../Client/Dispatch"));
const execute = objectify(require("./Execute"));
const wait = objectify(require("./Wait"));

const reserved = { dispatch, execute, wait };

const workflow = function workflow(name, definition) {
  // check that provided data have the right format
  if (typeof name !== "string") {
    throw new InvalidArgumentError(
      "When getting or creating a workflow, 1st parameter must be a string (workflow name)",
    );
  }

  // Class getter
  if (undefined === definition) {
    return workflowManager.get(name);
  }

  // check definition
  if (typeof definition !== "function" && typeof definition !== "object") {
    throw new InvalidArgumentError(
      `When creating worflow "${name}", 2nd parameter (workflow implemention) must be a function or an object`,
    );
  }
  if (typeof definition === "object") {
    if (undefined === definition.handle) {
      throw new InvalidArgumentError(
        `When creating worflow "${name}", 2nd parameter (workflow definition) must have a "handle" method`,
      );
    }
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
  };

  // set class name
  Object.defineProperty(WorkflowClass, "name", { value: name });

  // set reserved keywords
  Object.keys(reserved).forEach((method) => {
    Object.defineProperty(WorkflowClass.prototype, method, {
      value: reserved[method],
      writable: false,
      configurable: false,
    });
  });

  // set user-defined methods
  if (typeof definition === "function") {
    WorkflowClass.prototype.handle = definition;
  } else {
    Object.keys(definition).forEach((method) => {
      if (typeof definition[method] !== "function") {
        throw new InvalidArgumentError(
          `When creating worflow "${name}", "${method}" must be a function`,
        );
      }
      WorkflowClass.prototype[method] = definition[method];
    });
  }

  // register it in our workflow manager
  workflowManager.set(name, WorkflowClass);

  return WorkflowClass;
};

module.exports = workflow;
