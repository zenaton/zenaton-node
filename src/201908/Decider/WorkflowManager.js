const serializer = require("../Services/Serializer");
const { ExternalZenatonError } = require("../../Errors");

let instance;

const WorkflowManager = class WorkflowManager {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.workflows = {};
  }

  check(name) {
    const WorkflowClass = this.get(name);
    if (undefined === WorkflowClass) {
      throw new ExternalZenatonError(
        `Unknown workflow "${name}", please add it to your --boot file`,
      );
    }
    return WorkflowClass;
  }

  set(name, workflow) {
    if (undefined !== this.get(name)) {
      throw new ExternalZenatonError(
        `Workflow "${name}" can not be defined twice`,
      );
    }

    this.workflows[name] = workflow;
  }

  get(name) {
    return this.workflows[name];
  }

  getInstance(name, encodedProperties = null) {
    // unserialize properties
    const properties =
      encodedProperties === null ? {} : serializer.decode(encodedProperties);
    // get workflow class
    const WorkflowClass = this.check(name);
    // return instance with properties
    const w = new WorkflowClass();
    w._properties = properties;
    return w;
  }
};

module.exports = new WorkflowManager();
