const { ExternalZenatonError } = require("../../../Errors");

const Execute = class Execute {
  constructor(processor, service, serviceId) {
    this._processor = processor;
    this._service = service;
    this._serviceId = serviceId;
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
    if (!this._processor.executeTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "dispatch.${verb}" syntax from here`,
      );
    }
    return this._processor.executeTask(
      this._getHttpJob(verb, url, body, header),
    );
  }

  _getHttpJob(verb, url, body, header) {
    const name = this._service ? `${this._service}:${verb}` : `Http:${verb}`;
    const input = { url, body, header };
    if (this._service) {
      input.service = this._service;
      input.serviceId = this._serviceId;
    }
    return {
      name,
      input: [input],
      options: this._options,
      customId: this._customId,
    };
  }

  _getJob() {
    return {
      name: this._name,
      input: this._input,
    };
  }
};

module.exports = Execute;
