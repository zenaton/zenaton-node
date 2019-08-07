const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const Engine = require("../Engine");

module.exports = class Wait {
  constructor() {
    this.options = {};
  }

  static async for(duration) {
    if (!Number.isInteger(duration)) {
      throw new InvalidArgumentError(
        "First parameter of 'wait.for' must be an integer (wait's duration)",
      );
    }
    return new Engine().executeTask(
      "zenaton:wait",
      { event: null, duration },
      this.options,
    );
  }
};
