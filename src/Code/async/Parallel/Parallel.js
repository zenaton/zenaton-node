const Engine = require("../Engine/Engine");

module.exports = class Parallel {
  constructor(...items) {
    this.items = items;
  }

  async dispatch() {
    const result = await new Engine().dispatch(this.items);
    return Promise.all(result).then((unwrappedResult) =>
      unwrappedResult.map(() => undefined),
    );
  }

  async execute() {
    const result = await new Engine().execute(this.items);
    return Promise.all(result);
  }
};
