const uuidv4 = require("uuid/v4");
const { ExternalZenatonError } = require("../../../Errors");

const Connector = class Connector {
  constructor(service, serviceId, processor) {
    this._checkString(service, "First", "connector's name");
    if (service !== "http") {
      this._checkString(serviceId, "Second", "connector's id");
    }

    this._service = service;
    this._serviceId = serviceId;
    this._processor = processor;
  }

  post(url, body, header) {
    return this._http("post", url, body, header);
  }

  get(url, body, header) {
    return this._http("get", url, body, header);
  }

  put(url, body, header) {
    return this._http("put", url, body, header);
  }

  patch(url, body, header) {
    return this._http("patch", url, body, header);
  }

  delete(url, body, header) {
    return this._http("delete", url, body, header);
  }

  _http(verb, url, body, headers) {
    if (!this._processor.runTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "${this._service}.${verb}" syntax from here`,
      );
    }
    return this._processor.runTask(this._getJob(verb, url, body, headers));
  }

  _getJob(verb, url, body, headers) {
    this._checkString(url, "First", "url", verb);

    return {
      name: `${this._service}:${verb}`,
      input: [
        {
          service: this._service,
          serviceId: this._serviceId,
          verb,
          url,
          body,
          headers,
        },
      ],
      intentId: uuidv4(),
    };
  }

  _checkString(val, position, type, verb) {
    if (typeof val !== "string") {
      throw new ExternalZenatonError(
        `${position} parameter of "${
          this._service
        }.${verb}" must be a string (${type}) - not a "${typeof id}"`,
      );
    }
    if (typeof val !== "string" || val.length > 128) {
      throw new ExternalZenatonError(
        `${position} parameter of "${
          this._service
        }.${verb}" (${type}) must have less than 128 characters"`,
      );
    }
  }
};

module.exports = Connector;
