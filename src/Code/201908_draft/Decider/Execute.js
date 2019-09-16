const { ExternalZenatonError } = require("../../../Errors");

const Execute = class Execute {
  constructor(processor) {
    this._processor = processor;
  }

  async task(name, ...input) {
    if (!this._processor.executeTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "execute.task" syntax from here`,
      );
    }
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `First parameter of Parameter "execute.task" should be a string, not a "${typeof name}"`,
      );
    }
    this._input = input;
    this._name = name;

    return this._processor.executeTask(this._getJob());
  }

  _getJob() {
    return {
      name: this._name,
      input: this._input,
    };
  }
};

module.exports = Execute;
