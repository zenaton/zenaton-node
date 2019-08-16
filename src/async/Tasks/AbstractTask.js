const CronParser = require("cron-parser");
const TaskContext = require("../Runtime/Contexts/TaskContext");

const Engine = require("../Engine/Engine");
const { ZenatonError } = require("../../Errors");

module.exports = class AbstractTask {
  constructor(name) {
    // class name
    this.name = name;
    this._context = null;
  }

  setContext(context) {
    if (this._context !== null) {
      throw new ZenatonError("Context is already set and cannot be mutated.");
    }
    this._context = context;
  }

  getContext() {
    if (this._context === null) {
      return new TaskContext();
    }

    return this._context;
  }

  // asynchronous execution within a workflow
  async schedule() {
    const result = await new Engine().dispatch([this]);
    return result[0].then(() => undefined);
  }

  // asynchronous execution within a workflow
  async dispatch(...args) {
    return this.schedule(...args);
  }

  // synchronous execution within a workflow
  async execute() {
    const result = await new Engine().execute([this]);
    return result[0];
  }

  repeat(cron) {
    if (typeof cron !== "string") {
      throw new ZenatonError(
        "Param passed to 'repeat' function must be a string",
      );
    }

    try {
      CronParser.parseExpression(cron);
    } catch (err) {
      throw new ZenatonError(
        "Param passed to 'repeat' function is not a proper CRON expression",
      );
    }

    this.scheduling = this.scheduling || {};
    this.scheduling.cron = cron;

    return this;
  }

  static methods() {
    return ["handle", "maxProcessingTime", "onFailureRetryDelay"];
  }
};
