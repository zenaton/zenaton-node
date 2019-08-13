const uuidv4 = require("uuid/v4");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const client = require("./Client");

const MAX_ID_SIZE = 256;

const Dispatch = class Dispatch {
  constructor() {
    this.name = null;
    this.input = null;
    this.options = null;
    this.customId = null;
    this.intentId = uuidv4();
    this.promise = null;
  }

  withId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new InvalidArgumentError(
        `Parameter of "dispatch.withId" must be a string or an integer - not a "${typeof id}"`,
      );
    }
    if (id.toString().length >= MAX_ID_SIZE) {
      throw new InvalidArgumentError(
        `Parameter of "dispatch.withId" must not exceed ${MAX_ID_SIZE} bytes`,
      );
    }
    this.customId = id.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new InvalidArgumentError(
        `Parameter of "dispatch.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this.options = options;

    return this;
  }

  async task(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `First parameter of "dispatch.task" should be a string, not a "${typeof name}"`,
      );
    }
    this.type = "task";
    this.input = input;
    this.name = name;
    this.promise = await client.dispatchTask(this._getJob());

    return this;
  }

  async workflow(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `First parameter of Parameter "dispatch.workflow" should be a string, not a "${typeof name}"`,
      );
    }
    this.type = "workflow";
    this.input = input;
    this.name = name;
    this.promise = await client.dispatchWorkflow(this._getJob());

    return this;
  }

  _getJob() {
    return {
      type: this.type,
      name: this.name,
      input: this.input,
      options: this.options,
      customId: this.customId,
      intentId: this.intentId,
      promise: this.promise,
    };
  }
};

module.exports = Dispatch;
