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

  set processor(processor) {
    this.clients.forEach((client) => {
      // eslint-disable-next-line no-param-reassign
      client.processor = processor;
    });
  }

  add(client) {
    if (this.get(client.name) !== null) {
      throw new ExternalZenatonError(
        client.name
          ? `Client "${client.name}" can not be defined twice`
          : `You must name Client if you use more than one`,
      );
    }
    this.clients.push(client);
  }

  // search by name
  get(name) {
    const cs = this.clients.filter((c) => c.name === name);
    if (cs.length > 0) return cs[0];
    return null;
  }
};

module.exports = new ClientManager();
