const uuidv4 = require("uuid/v4");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const client = require("../Client/Client");

const Execute = class Execute {
  constructor() {
    this.type = null;
    this.name = null;
    this.input = [];
    this.options = {};
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
    return client._executeTask(this._getJob());
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
