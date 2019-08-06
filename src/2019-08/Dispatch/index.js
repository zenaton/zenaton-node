const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const Engine = require("../Engine");

module.exports = class Dispatch {
  constructor() {
    this.options = {};
  }

  static async task(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        "First parameter of 'Dispatch.task' must be a string (task's name)",
      );
    }
    return new Engine().dispatchTask(name, input, this.options);
  }

  static async workflow(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        "First parameter of 'Dispatch.workflow' must be a string (workflow's name)",
      );
    }

    return new Engine().dispatchWorkflow(name, input, this.options);
  }
};
