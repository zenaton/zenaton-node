const Interface = require("../Services/Interface");

module.exports = new Interface(
  "executeTask",
  "dispatchTask",
  "sendEvent",
  "killWorkflow",
  "pauseWorkflow",
  "resumeWorkflow",
);
