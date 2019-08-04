const { serializer } = require("../Services");
const { InvalidArgumentError } = require("../../Errors");

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
    let WorkflowClass = this.getClass(name);
    // if Version => the workflow was versioned meanwhile => get the initial class
    if (WorkflowClass.name === "VersionClass") {
      WorkflowClass = WorkflowClass.getInitialClass();
    }
    // do not use init function to set data
    WorkflowClass._useInit = false;
    // return new workflow instance
    // Object.create(workflowClass);
    const workflow = new WorkflowClass(data);
    // avoid side effect
    WorkflowClass._useInit = true;
    // return workflow
    return workflow;
  }
};

module.exports = new WorkflowManager();
