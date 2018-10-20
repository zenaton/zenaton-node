const util = require("util");
const serializer = require("../Services/Serializer");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");

let instance;

const WorkflowManager = class {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.workflows = {};
  }

  setClass(name, workflow) {
    // check that this workflow does not exist yet
    if (undefined !== this.getClass(name)) {
      throw new InvalidArgumentError(
        `"${name}" workflow can not be defined twice`,
      );
    }

    this.workflows[name] = workflow;
  }

  getClass(name) {
    return this.workflows[name];
  }

  getWorkflow(name, encodedData) {
    // unserialize data
    const data = serializer.decode(encodedData);
    // get workflow class
    let workflowClass = this.getClass(name);
    // if Version => the workflow was versioned meanwhile => get the initial class
    if (workflowClass.name === "VersionClass") {
      workflowClass = workflowClass.getInitialClass();
    }
    // do not use init function to set data
    workflowClass._useInit = false;
    // return new workflow instance
    // Object.create(workflowClass);
    const workflow = new workflowClass(data);
    // avoid side effect
    workflowClass._useInit = true;
    // return workflow
    return workflow;
  }
};

module.exports = new WorkflowManager();
