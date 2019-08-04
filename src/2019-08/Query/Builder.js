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
  async find() {
    const instance = await this.client.findWorkflow(
      this.workflowClass,
      this.id,
    );
    return instance;
  }

  /**
   * Send an event to a workflow instance
   */
  async send(eventName, eventData = {}) {
    await this.client.sendEvent(
      this.workflowClass,
      this.id,
      eventName,
      eventData,
    );
  }

  /**
   * Kill a workflow instance
   */
  async kill() {
    await this.client.killWorkflow(this.workflowClass, this.id);
  }

  /**
   * Pause a workflow instance
   */
  async pause() {
    await this.client.pauseWorkflow(this.workflowClass, this.id);
  }

  /**
   * Resume a workflow instance
   */
  async resume() {
    await this.client.resumeWorkflow(this.workflowClass, this.id);
  }
};
