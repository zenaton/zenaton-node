const Client = require("../Client");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const workflowManager = require("../Workflows/Manager");
const taskManager = require("../Tasks/Manager");

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

  getInstanceId() {
    return this.processor &&
      typeof this.processor.microserver.getInstanceId === "function"
      ? this.processor.microserver.getInstanceId()
      : undefined;
  }

  setProcessor(processor) {
    this.processor = processor;
  }

  async dispatchTask(name, input, options) {
    // processing from outside an Agent
    if (this.processor == null) {
      return this.client.dispatchTask(name, input, options);
    }

    // processing from inside the Agent
    return this.processor.dispatchTask(name, input, options);
  }

  async dispatchWorkflow(name, input, options) {
    // processing from outside an Agent
    if (this.processor == null) {
      return this.client.dispatchWorkflow(name, input, options);
    }

    // processing from inside the Agent
    return this.processor.dispatchWorkflow(name, input, options);
  }

  async executeTask(name, input, options) {
    // processing from outside an Agent
    if (this.processor == null) {
      console.warn(
        `Warning - using Execute.task("${name}") syntax locally is for dev only`,
      );
      return taskManager.getInstance(name).handle(input);
    }

    // processing from inside the Agent
    return this.processor.executeTask(name, input, options);
  }

  async executeWorkflow(name, input, options) {
    // processing from outside an Agent
    if (this.processor == null) {
      console.warn(
        `Warning - using Execute.workflow("${name}") syntax locally is for dev only`,
      );
      return workflowManager.getInstance(name).handle(input);
    }

    // processing from inside the Agent
    return this.processor.executeWorkflow(name, input, options);
  }

  async execute(jobs) {
    if (!jobs.length) {
      return [];
    }

    // check arguments'type
    this.checkArguments(jobs);

    // local execution
    if (this.processor == null) {
      // simply apply handle method
      const outputs = jobs.map(async (job) => {
        const handler = this.isWorkflow(job)
          ? job.handle()
          : job._promiseHandle();

        return handler;
      });

      // return results
      return outputs;
    }

    // executed by Zenaton processor
    return this.processor.process(jobs, true);
  }

  async dispatch(jobs) {
    if (!jobs.length) {
      return [];
    }

    // check arguments'type
    this.checkArguments(jobs);

    // local execution
    if (this.processor == null) {
      // dispatch works to Zenaton
      const outputs = jobs.map(async (job) => {
        const handler = this.isWorkflow(job)
          ? this.client.startWorkflow(job)
          : this.client.startTask(job);

        await handler;

        return undefined;
      });

      // return results
      return outputs;
    }

    // executed by Zenaton processor
    return this.processor.process(jobs, false);
  }

  checkArguments(jobs) {
    const allWorkflowOrTask = jobs.every(
      (job) => this.isWorkflow(job) || this.isTask(job),
    );

    if (!allWorkflowOrTask) {
      throw new InvalidArgumentError(
        "You can only execute or dispatch Zenaton Task or Workflow",
      );
    }
  }

  isWorkflow(job) {
    return (
      typeof job === "object" &&
      typeof job.name === "string" &&
      workflowManager.getClass(job.name) != null
    );
  }

  isTask(job) {
    return (
      typeof job === "object" &&
      typeof job.name === "string" &&
      taskManager.getClass(job.name) != null
    );
  }
};
