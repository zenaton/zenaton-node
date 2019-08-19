const Alfred = require("./Alfred");
const Dispatch = require("./Dispatch");
const Select = require("./Select");
const ProcessorInterface = require("./ProcessorInterface");
const Interface = require("../Services/Interface");
const clientManager = require("./ClientManager");

const Client = class Client {
  constructor(appId, apiToken, appEnv, name = "") {
    this.appId = appId;
    this.apiToken = apiToken;
    this.appEnv = appEnv;
    this.name = name;

    this.dispatch = new Dispatch();
    this.select = new Select();

    // default processor
    this.processor = new Alfred(appId, apiToken, appEnv);

    // add to manager
    clientManager.add(this);
  }

  set processor(processor) {
    Interface.check(processor, ProcessorInterface);
    this.dispatch.processor = processor;
    this.select.processor = processor;
  }
};

module.exports = Client;
