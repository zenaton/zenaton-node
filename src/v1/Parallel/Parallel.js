const Engine = require("../Engine/Engine");

module.exports = class Parallel {
  constructor(items = []) {
    this.items = items;
  }

  dispatch() {
    new Engine().dispatch(this.items);
  }

  execute() {
    return new Engine().execute(this.items);
  }
};
