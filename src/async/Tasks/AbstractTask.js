const Engine = require("../Engine/Engine");

module.exports = class AbstractTask {
  constructor(name) {
    // class name
    this.name = name;
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
    return ["handle", "maxProcessingTime"];
  }
};
