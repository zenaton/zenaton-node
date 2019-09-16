const uuidv4 = require("uuid/v4");
const versioner = require("../Services/Versioner");
const { ExternalZenatonError } = require("../../../Errors");

const MAX_ID_SIZE = 256;

const Dispatch = class Dispatch {
  constructor(processor) {
    this.name = null;
    this.input = null;
    this.options = null;
    this.customId = null;
    this.intentId = uuidv4();
    this.promise = null;

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
    this.customId = id.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this.options = options;

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
    this.promise = await this._processor.dispatchTask(
      this._getJob("task", name, input),
    );

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
    this.promise = await this._processor.dispatchWorkflow(
      this._getJob("workflow", name, input),
    );

    return this;
  }

  async post(url, body, headers) {
    return this._processor.dispatchTask(
      this._getJob("post", url, body, headers),
    );
  }

  async get(url, body, headers) {
    return this._processor.dispatchTask(
      this._getJob("get", url, body, headers),
    );
  }

  async put(url, body, headers) {
    return this._processor.dispatchTask(
      this._getJob("put", url, body, headers),
    );
  }

  async patch(url, body, headers) {
    return this._processor.dispatchTask(
      this._getJob("patch", url, body, headers),
    );
  }

  async delete(url, body, headers) {
    return this._processor.dispatchTask(
      this._getJob("delete", url, body, headers),
    );
  }

  _getJob(type, name, input) {
    const { canonical } = versioner(name);

    return {
      type,
      name,
      canonical,
      input,
      options: this.options,
      customId: this.customId,
      intentId: this.intentId,
      promise: this.promise,
    };
  }
};

module.exports = Dispatch;
