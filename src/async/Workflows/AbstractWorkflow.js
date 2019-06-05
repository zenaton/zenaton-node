const CronParser = require("cron-parser");

const Engine = require("../Engine/Engine");
const { ZenatonError } = require("../../Errors");

module.exports = class AbstractWorkflow {
  constructor(name) {
    // class name
    this.name = name;
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
    return [
      "handle",
      "id",
      "onEvent",
      "onStart",
      "onSuccess",
      "onFailure",
      "onTimeout",
    ];
  }
};
