const { ExternalZenatonError } = require("../../../Errors");

const MAX_ID_SIZE = 256;

const Dispatch = class Dispatch {
  constructor(processor) {
    this._processor = processor;
  }

  withId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withId" must be a string or an integer - not a "${typeof id}"`,
      );
    }
    if (id.toString().length >= MAX_ID_SIZE) {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withId" must not exceed ${MAX_ID_SIZE} bytes`,
      );
    }
    this._customId = id.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this._options = options;

    return this;
  }

  async task(name, ...input) {
    if (!this._processor.dispatchTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "dispatch.task" syntax from here`,
      );
    }
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `First parameter of "dispatch.task" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new ExternalZenatonError(
        `First parameter of Parameter "dispatch.task" should be a non-empty string`,
      );
    }
    this._type = "task";
    this._input = input;
    this._name = name;
    this._promise = await this._processor.dispatchTask(this._getJob());

    return this;
  }

  async workflow(name, ...input) {
    if (!this._processor.dispatchWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "dispatch.workflow" syntax from here`,
      );
    }
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `First parameter of Parameter "dispatch.workflow" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new ExternalZenatonError(
        `First parameter of Parameter "dispatch.workflow" should be a non-empty string`,
      );
    }
    this._input = input;
    this._name = name;

    this._promise = await this._processor.dispatchWorkflow(this._getJob());

    return this;
  }

  _getJob() {
    return {
      name: this._name,
      input: this._input,
      options: this._options,
      customId: this._customId,
      promise: this._promise,
    };
  }
};

module.exports = Dispatch;
