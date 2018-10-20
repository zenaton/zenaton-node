const Client = require("../Client");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const workflowManager = require("../Workflows/WorkflowManager");
const taskManager = require("../Tasks/TaskManager");

let instance = null;

module.exports = class Engine {
  constructor() {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.client = new Client();

    // No processor
    this.processor = null;
  }

  setProcessor(processor) {
    this.processor = processor;
  }

  execute(jobs) {
    // check arguments'type
    this.checkArguments(jobs);

    // local execution
    if (this.processor === null || jobs.length == 0) {
      const outputs = [];
      // simply apply handle method
      jobs.forEach((job) => {
        if (this.isWorkflow(job)) {
          outputs.push(job.handle());
        } else if (this.isTask(job)) {
          outputs.push(job._promiseHandle());
        } else {
          throw new InvalidArgumentError();
        }
      });
      // return results
      return outputs;
    }

    // executed by Zenaton processor
    return this.processor.process(jobs, true);
  }

  dispatch(jobs) {
    // check arguments'type
    this.checkArguments(jobs);

    // local execution
    if (this.processor === null || jobs.length == 0) {
      const outputs = [];
      // dispatch works to Zenaton (only workflows by now)
      jobs.forEach((job) => {
        if (this.isWorkflow(job)) {
          outputs.push(this.client.startWorkflow(job));
        } else if (this.isTask(job)) {
          // outputs.push(this.client.startTask(job))
          outputs.push(job._promiseHandle());
        } else {
          throw new InvalidArgumentError();
        }
      });
      // return results
      return outputs;
    }

    // executed by Zenaton processor
    return this.processor.process(jobs, false);
  }

  checkArguments(jobs) {
    jobs.forEach((job) => {
      if (!this.isWorkflow(job) && !this.isTask(job)) {
        throw new InvalidArgumentError(
          "You can only execute or dispatch Zenaton Task or Workflow",
        );
      }
    });
  }

  isWorkflow(job) {
    return (
      typeof job === "object" &&
      typeof job.name === "string" &&
      undefined !== workflowManager.getClass(job.name)
    );
  }

  isTask(job) {
    return (
      typeof job === "object" &&
      typeof job.name === "string" &&
      undefined !== taskManager.getClass(job.name)
    );
  }
};
