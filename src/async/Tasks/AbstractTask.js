const TaskContext = require("../Runtime/Contexts/TaskContext");
const Engine = require("../Engine/Engine");
const { ZenatonError } = require("../../Errors");

module.exports = class AbstractTask {
  constructor(name) {
    // class name
    this.name = name;
    this._context = null;
  }

  get context() {
    if (this._context === null) {
      return new TaskContext();
    }

    return this._context;
  }

  set context(context) {
    if (this._context !== null) {
      throw new ZenatonError("Context is already set and cannot be mutated.");
    }
    this._context = context;
  }

  // asynchronous execution within a workflow
  async schedule(cron) {
    if (typeof cron !== "string" || cron === "") {
      throw new ZenatonError(
        "Param passed to 'schedule' function must be a non empty string",
      );
    }

    this.scheduling = this.scheduling || {};
    this.scheduling.cron = cron;

    const result = await new Engine().dispatch([this]);
    return result[0].then(() => undefined);
  }

  // asynchronous execution within a workflow
  async dispatch() {
    const result = await new Engine().dispatch([this]);
    return result[0].then(() => undefined);
  }

  // synchronous execution within a workflow
  async execute() {
    const result = await new Engine().execute([this]);
    return result[0];
  }

  static methods() {
    return ["handle", "maxProcessingTime", "onFailureRetryDelay"];
  }
};
