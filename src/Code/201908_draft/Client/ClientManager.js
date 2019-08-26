const { ExternalZenatonError } = require("../../../Errors");

let instance;

const ClientManager = class ClientManager {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.clients = [];
  }

  add(client) {
    if (this.get(client.name) !== undefined) {
      throw new ExternalZenatonError(
        client.name
          ? `Client "${client.name}" can not be defined twice`
          : `You must name Client if you use more than one`,
      );
    }
    this.clients.push(client);
  }

  get(name) {
    return this.clients.find((c) => c.name === name);
  }

  all() {
    return this.clients;
  }
};

module.exports = new ClientManager();
