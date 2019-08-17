const Client = require("./Client");
const Engine = require("./Engine/Engine");
const { Task, taskManager, Wait } = require("./Tasks");
const { Workflow, workflowManager, Version } = require("./Workflows");
const { serializer } = require("./Services");
const Parallel = require("./Parallel/Parallel");

// if below functions are already defined, use Parallel class

// Parallel dispatchs
if (!Array.prototype.dispatch) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.dispatch = function dispatch() {
    console.warn(
      "DeprecationWarning: Usage of '[a, b, c].dispatch()' is deprecated.\nPlease use 'new Parallel(a, b, c).dispatch()' instead.",
    );
    return new Engine().dispatch(this);
  };
}

// Parallel executions
if (!Array.prototype.execute) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.execute = function execute() {
    console.warn(
      "DeprecationWarning: Usage of '[a, b, c].execute()' is deprecated.\nPlease use 'new Parallel(a, b, c).execute()' instead.",
    );
    return new Engine().execute(this);
  };
}

module.exports = {
  Client,
  Engine,
  Task,
  taskManager,
  Wait,
  Workflow,
  workflowManager,
  Version,
  serializer,
  Parallel,
};
