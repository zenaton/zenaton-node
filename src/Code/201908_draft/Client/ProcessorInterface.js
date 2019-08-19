const Interface = require("../Services/Interface");

module.exports = new Interface(
  "dispatchTask",
  "dispatchWorkflow",
  "scheduleTask",
  "scheduleWorkflow",
  "sendEvent",
  "killWorkflow",
  "pauseWorkflow",
  "resumeWorkflow",
);
