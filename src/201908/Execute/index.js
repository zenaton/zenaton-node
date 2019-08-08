const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const Engine = require("../Engine");

module.exports = class Execute {
  constructor() {
    this.options = {};
  }

  static async task(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        "First parameter of 'Execute.task' must be a string (task's name)",
      );
    }
    return new Engine().executeTask(name, input, this.options);
  }
};
