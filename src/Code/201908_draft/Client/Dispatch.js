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
    this.promise = await this._processor.dispatchTask(
      this._getJob(name, input),
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
      this._getJob(name, input),
    );

    return this;
  }

  async post(url, body, headers) {
    return this._processor.dispatchTask(
      this._getHttpJob("post", url, body, headers),
    );
  }

  async get(url, body, headers) {
    return this._processor.dispatchTask(
      this._getHttpJob("get", url, body, headers),
    );
  }

  async put(url, body, headers) {
    return this._processor.dispatchTask(
      this._getHttpJob("put", url, body, headers),
    );
  }

  async patch(url, body, headers) {
    return this._processor.dispatchTask(
      this._getHttpJob("patch", url, body, headers),
    );
  }

  async delete(url, body, headers) {
    return this._processor.dispatchTask(
      this._getHttpJob("delete", url, body, headers),
    );
  }

  _getJob(name, input) {
    return {
      name,
      input,
      options: this._options,
      customId: this._customId,
      promise: this._promise,
    };
  }
};

module.exports = Dispatch;
