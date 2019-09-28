const Alfred = require("./Alfred");
const Run = require("./Run");
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

  connector(service, serviceId) {
    return new Connector(service, serviceId, this._processor);
  }

  get schedule() {
    return (cron) => new Schedule(cron, this._processor);
  }

  get run() {
    return objectify(Run, this._processor);
  }

  get select() {
    return objectify(Select, this._processor);
  }

  set schedule(_d) {
    throw new ExternalZenatonError(
      '"schedule" is reserved and can not be mutated',
    );
  }

  set run(_d) {
    throw new ExternalZenatonError(
      '"run" is reserved and can not be mutated  ',
    );
  }

  set select(_s) {
    throw new ExternalZenatonError(
      '"select" is reserved and can not be mutated',
    );
  }
};

module.exports = Client;
