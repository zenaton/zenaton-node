const Alfred = require("./Alfred");
const Dispatch = require("./Dispatch");
const Select = require("./Select");
const Schedule = require("./Schedule");
const Connector = require("./Connector");
const clientManager = require("./ClientManager");
const objectify = require("../Services/Objectify");
const { ExternalZenatonError } = require("../../../Errors");

const Client = class Client {
  constructor(appId, apiToken, appEnv, name = "") {
    this.appId = appId;
    this.apiToken = apiToken;
    this.appEnv = appEnv;
    this.name = name;

    // default processor
    this._processor = new Alfred(this);

    // add to manager
    clientManager.add(this);
  }

  static all() {
    return clientManager.all();
  }

  static get(name) {
    return clientManager.get(name);
  }

  set processor(processor) {
    this._processor = processor;
  }

  get connector() {
    return (service, input) =>
      objectify(Connector, service, input, this._processor);
  }

  get dispatch() {
    return objectify(Dispatch, this._processor);
  }

  get select() {
    return objectify(Select, this._processor);
  }

  get schedule() {
    return objectify(Schedule, this._processor);
  }

  set connector(_c) {
    throw new ExternalZenatonError(
      'Sorry, "connector" is reserved and can not be mutated',
    );
  }

  set dispatch(_d) {
    throw new ExternalZenatonError(
      'Sorry, "dispatch" is reserved and can not be mutated',
    );
  }

  set select(_s) {
    throw new ExternalZenatonError(
      'Sorry, "select" is reserved and can not be mutated',
    );
  }

  set schedule(_s) {
    throw new ExternalZenatonError(
      'Sorry, "schedule" is reserved and can not be mutated',
    );
  }
};

module.exports = Client;
