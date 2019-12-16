const uuidv4 = require("uuid/v4");

const InstantTask = class InstantTask {
  constructor(name, processor) {
    this.name = name;
    this._processor = processor;
  }

  execute(...input) {
    return this._processor.runInstantTask(this._getJob(this.name, input));
  }

  _getJob(name, input) {
    return {
      name,
      input,
      intentId: uuidv4(),
    };
  }
};
module.exports = InstantTask;
