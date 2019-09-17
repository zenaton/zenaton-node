const { ExternalZenatonError } = require("../../../Errors");

const MAX_ID_SIZE = 256;

const Dispatch = class Dispatch {
  constructor(processor, service, authId) {
    this._processor = processor;
    this._service = service;
    this._authId = authId;
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
      this._getTaskJob(name, input),
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
      this._getTaskJob(name, input),
    );

    return this;
  }

  async post(url, body, header) {
    return this._http("post", url, body, header);
  }

  async get(url, body, header) {
    return this._http("get", url, body, header);
  }

  async put(url, body, header) {
    return this._http("put", url, body, header);
  }

  async patch(url, body, header) {
    return this._http("patch", url, body, header);
  }

  async delete(url, body, header) {
    return this._http("delete", url, body, header);
  }

  async _http(verb, url, body, header) {
    if (!this._processor.dispatchTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "dispatch.${verb}" syntax from here`,
      );
    }
    return this._processor.dispatchTask(
      this._getHttpJob(verb, url, body, header),
    );
  }

  _getHttpJob(verb, url, body, header) {
    return {
      name: `Http:${verb}`,
      input: [
        {
          url,
          body,
          header,
        },
      ],
      options: this._options,
      customId: this._customId,
    };
  }

  _getTaskJob(name, input) {
    return {
      name,
      input,
      options: this._options,
      customId: this._customId,
    };
  }
};

module.exports = Dispatch;
