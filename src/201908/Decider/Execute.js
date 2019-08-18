const uuidv4 = require("uuid/v4");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");

const Execute = class Execute {
  constructor(processor) {
    this._processor = processor;
    this.type = null;
    this.name = null;
    this.input = [];
    this.options = {};
  }

  set processor(processor) {
    this._processor = processor;
    return this;
  }

  async task(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `First parameter of Parameter "Execute.task" should be a string, not a "${typeof name}"`,
      );
    }
    this.type = "task";
    this.name = name;
    this.input = input;
    return this._processor.executeTask(this._getJob());
  }

  _getJob() {
    return {
      type: this.type,
      name: this.name,
      input: this.input,
      options: this.options,
      intentId: uuidv4(),
    };
  }
};

module.exports = Execute;
