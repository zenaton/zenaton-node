const Client = require("../Client");

module.exports = class QueryBuilder {
  constructor(workflowClass) {
    this.client = new Client();
    this.workflowClass = workflowClass;
  }

  /**
   * Create a new pending job dispatch.
   */
  whereId(id) {
    this.id = id;

    return this;
  }

  /**
   * Retrieve an instance
   */
  find() {
    return this.client.findWorkflow(this.workflowClass, this.id);
  }

  /**
   * Send an event to a workflow instance
   */
  send(eventName, eventData) {
    return this.client.sendEvent(
      this.workflowClass,
      this.id,
      eventName,
      eventData,
    );
  }

  /**
   * Kill a workflow instance
   */
  kill() {
    this.client.killWorkflow(this.workflowClass, this.id);

    return this;
  }

  /**
   * Pause a workflow instance
   */
  pause() {
    this.client.pauseWorkflow(this.workflowClass, this.id);

    return this;
  }

  /**
   * Resume a workflow instance
   */
  resume() {
    this.client.resumeWorkflow(this.workflowClass, this.id);

    return this;
  }
};
