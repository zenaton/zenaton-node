const Alfred = require("./Alfred");
const Dispatch = require("./Dispatch");
const Select = require("./Select");

const Client = class Client {
  constructor(appId, apiToken, appEnv) {
    const alfred = new Alfred(appId, apiToken, appEnv);

    this.dispatch = new Dispatch(alfred);

    this.select = new Select(alfred);
  }
};

module.exports = Client;
