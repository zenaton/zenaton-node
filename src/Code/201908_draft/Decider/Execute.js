const { ExternalZenatonError } = require("../../../Errors");

const Execute = class Execute {
  constructor(processor) {
    this._type = null;
    this._name = null;
    this._input = [];
    this._options = {};

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
    this._type = "task";
    this._name = name;
    this._input = input;
    return this._processor.executeTask(this._getJob());
  }

  _getJob() {
    return {
      type: this._type,
      name: this._name,
      input: this._input,
      options: this._options,
    };
  }
};

module.exports = Execute;
