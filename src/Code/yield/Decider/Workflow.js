const { ExternalZenatonError } = require("../../../Errors");
const workflowManager = require("./WorkflowManager");
const Run = require("../Client/Run");
const Schedule = require("../Client/Schedule");
const Connector = require("../Client/Connector");
const Select = require("../Client/Select");
const Wait = require("./Wait");
const objectify = require("../Services/Objectify");

const workflow = function workflow(name, definition) {
  // check that provided data have the right format
  if (typeof name !== "string" || name.length === 0) {
    throw new ExternalZenatonError(
      "When getting or creating a workflow, 1st parameter (workflow name) must be a non-empty string",
    );
  }
  //  workflow getter
  if (typeof definition === "undefined") {
    return workflowManager.get(name);
  }
  // check workflow definition
  if (typeof definition !== "function" && typeof definition !== "object") {
    throw new ExternalZenatonError(
      `When creating worflow "${name}", 2nd parameter (workflow definition) must be a function or an object`,
    );
  }
  if (typeof definition === "object") {
    if (definition.handle === undefined) {
      throw new ExternalZenatonError(
        `When creating worflow "${name}", 2nd parameter (workflow definition) must have a "handle" method`,
      );
    }
    const reservedMethods = [
      "handle",
      "onEvent",
      "onStart",
      "onSuccess",
      "onTimeout",
      "onFailure",
    ];
    Object.keys(definition).forEach((method) => {
      if (
        reservedMethods.indexOf(method) >= 0 &&
        typeof definition[method] !== "function"
      ) {
        throw new ExternalZenatonError(
          `When creating workflow "${name}",  "${method}" method must be a function, not a "${typeof definition[
            method
          ]}"`,
        );
      }
    });
  }

  const WorkflowClass = class WorkflowClass {
    set processor(processor) {
      this._processor = processor;
    }

    get properties() {
      const properties = {};
      Object.keys(this).forEach((prop) => {
        if (prop !== "_context" && prop !== "_processor") {
          properties[prop] = this[prop];
        }
      });
      return properties;
    }

    set properties(properties) {
      Object.keys(this).forEach((prop) => {
        if (prop !== "_context" && prop !== "_processor") {
          delete this[prop];
        }
      });
      Object.assign(this, properties);
    }

    get context() {
      return this._context;
    }

    set context(context) {
      if (this._context !== undefined) {
        throw new ExternalZenatonError(
          'Sorry, "context" is reserved and can not be mutated',
        );
      }
      this._context = context;
    }

    connector(service, serviceId) {
      return new Connector(service, serviceId, this._processor);
    }

    send(eventName, ...eventData) {
      return this._selectSelf().send(eventName, ...eventData);
    }

    schedule(cron) {
      return new Schedule(cron, this._processor);
    }

    pause() {
      return this._selectSelf().pause();
    }

    resume() {
      return this._selectSelf().resume();
    }

    terminate() {
      return this._selectSelf().terminate();
    }

    get run() {
      return objectify(Run, this._processor);
    }

    get select() {
      return objectify(Select, this._processor);
    }

    get wait() {
      return objectify(Wait, this._processor);
    }

    set run(_r) {
      throw new ExternalZenatonError(
        'Sorry, "run" is reserved and can not be mutated',
      );
    }

    set select(_s) {
      throw new ExternalZenatonError(
        'Sorry, "select" is reserved and can not be mutated',
      );
    }

    set execute(_e) {
      throw new ExternalZenatonError(
        'Sorry, "execute" is reserved and can not be mutated',
      );
    }

    set dispatch(_d) {
      throw new ExternalZenatonError(
        'Sorry, "dispatch" is reserved and can not be mutated',
      );
    }

    set wait(_w) {
      throw new ExternalZenatonError(
        'Sorry, "wait" is reserved and can not be mutated',
      );
    }

    _selectSelf() {
      return new Select(this._processor).workflow(name).withId(this.context.id);
    }
  };

  // set class name
  Object.defineProperty(WorkflowClass, "name", { value: name });

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
