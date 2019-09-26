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

  post(url, parameters) {
    return this._http("post", url, parameters);
  }

  get(url, parameters) {
    return this._http("get", url, parameters);
  }

  put(url, parameters) {
    return this._http("put", url, parameters);
  }

  patch(url, parameters) {
    return this._http("patch", url, parameters);
  }

  delete(url, parameters) {
    return this._http("delete", url, parameters);
  }

  _http(method, url, parameters) {
    if (!this._processor.runTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "${this._service}.${method}" syntax from here`,
      );
    }
    return this._processor.runTask(this._getJob(method, url, parameters));
  }

  _getJob(method, url, parameters) {
    this._checkString(url, "First", "url", method);

    return {
      name: `${this._service}:${method}`,
      input: [
        {
          service: this._service,
          serviceId: this._serviceId,
          method,
          url,
          parameters,
        },
      ],
      intentId: uuidv4(),
    };
  }

  _checkString(val, position, type, method) {
    if (typeof val !== "string") {
      throw new ExternalZenatonError(
        `${position} parameter of "${
          this._service
        }.${method}" must be a string (${type}) - not a "${typeof id}"`,
      );
    }
    if (typeof val !== "string" || val.length > 128) {
      throw new ExternalZenatonError(
        `${position} parameter of "${
          this._service
        }.${method}" (${type}) must have less than 128 characters"`,
      );
    }
  }
};

module.exports = Connector;
