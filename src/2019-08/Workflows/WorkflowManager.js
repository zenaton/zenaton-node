const { serializer } = require("../Services");
const { ExternalZenatonError } = require("../../Errors");

let instance;

const WorkflowManager = class {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.workflows = {};
  }

  checkClass(name) {
    const WorkflowClass = this.getClass(name);
    if (undefined === WorkflowClass) {
      throw new ExternalZenatonError(
        `Unknown workflow "${name}", please add it to your --boot file`,
      );
    }
    return WorkflowClass;
  }

  setClass(name, workflow) {
    // check that this workflow does not exist yet
    if (undefined !== this.getClass(name)) {
      throw new ExternalZenatonError(
        `Workflow "${name}" can not be defined twice`,
      );
    }

    this.workflows[name] = workflow;
  }

  getClass(name) {
    return this.workflows[name];
  }

  getInstance(name, encodedProperties = null) {
    // unserialize properties
    const properties =
      encodedProperties === null ? {} : serializer.decode(encodedProperties);
    // get workflow class
    let WorkflowClass = this.checkClass(name);
    // if Version => the workflow was versioned meanwhile => get the initial class
    if (WorkflowClass.name === "VersionClass") {
      WorkflowClass = WorkflowClass.getInitialClass();
    }
    // return new workflow instance
    return new WorkflowClass(properties);
  }
};

module.exports = new WorkflowManager();
