const { ExternalZenatonError } = require("../../../Errors");

const Connector = class Connector {
  constructor(service, authId, processor) {
    this._checkString(service, "First", "connector's name");
    this._service = service;
    this._checkString(authId, "Second", "connector's id");
    this._authId = authId;
    this._processor = processor;
  }

  async post(url, body, headers) {
    return this._processor.restConnector(
      this._getRestConnector("post", url, body, headers),
    );
  }

  async get(url, body, headers) {
    return this._processor.restConnector(
      this._getRestConnector("get", url, body, headers),
    );
  }

  async put(url, body, headers) {
    return this._processor.restConnector(
      this._getRestConnector("put", url, body, headers),
    );
  }

  async patch(url, body, headers) {
    return this._processor.restConnector(
      this._getRestConnector("patch", url, body, headers),
    );
  }

  async delete(url, body, headers) {
    return this._processor.restConnector(
      this._getRestConnector("delete", url, body, headers),
    );
  }

  _getRestConnector(verb, url, body, headers) {
    this._checkString(url, "First", "url", `.${verb}`);

    return {
      service: this._service,
      authId: this._authId,
      verb,
      url,
      body,
      headers,
    };
  }

  _checkString(val, position, type, method = "") {
    if (typeof val !== "string") {
      throw new ExternalZenatonError(
        `${position} parameter of "connector${method}" must be a string (${type}) - not a "${typeof id}"`,
      );
    }
    if (typeof val !== "string" || val.length > 128) {
      throw new ExternalZenatonError(
        `${position} parameter of "connector${method}" (${type}) must have less than 128 characters"`,
      );
    }
  }
};

module.exports = Connector;
