const client = require("./Client/Client");
const objectify = require("./Services/Objectify");
const dispatch = objectify(require("./Client/Dispatch"));
const select = objectify(require("./Client/Select"));
const workflow = require("./Decider/Workflow");
const workflowManager = require("./Decider/WorkflowManager");
const task = require("./Worker/Task");
const taskManager = require("./Worker/TaskManager");
const serializer = require("./Services/Serializer");
const versioner = require("./Services/Versioner");
const duration = require("./Services/Duration");
const datetime = require("./Services/DateTime");

module.exports = {
  client,
  select,
  dispatch,
  workflow,
  workflowManager,
  task,
  taskManager,
  duration,
  datetime,
  serializer,
  versioner,
};
