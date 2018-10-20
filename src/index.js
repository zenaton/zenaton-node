/* global process, __dirname, __filename */

// store path to this file for use by Zenaton worker
process.env.ZENATON_LIBRARY_PATH = require("path").resolve(
  __dirname,
  __filename,
);

const Errors = require("./Errors");

// v1 sources
const Client = require("./v1/Client");
const Engine = require("./v1/Engine/Engine");
const { Task, taskManager, Wait } = require("./v1/Tasks");
const { Workflow, workflowManager, Version } = require("./v1/Workflows");
const serializer = require("./v1/Services/Serializer");
const Parallel = require("./v1/Parallel/Parallel");

// if below functions are already defined, use Parallel class

// Parallel dispatchs
if (!Array.prototype.dispatch) {
  Array.prototype.dispatch = function() {
    new Engine().dispatch(this);
  };
}

// Parallel executions
if (!Array.prototype.execute) {
  Array.prototype.execute = function() {
    return new Engine().execute(this);
  };
}

module.exports = {
  Client,
  Engine,
  serializer,
  Parallel,
  Task,
  Wait,
  taskManager,
  Version,
  Workflow,
  workflowManager,
  Errors,
};
