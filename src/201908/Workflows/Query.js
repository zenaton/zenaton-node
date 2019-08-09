const { InvalidArgumentError } = require("../../Errors");
const Client = require("../Client");

const WorkflowQuery = class WorkflowQuery {
  constructor(name) {
    this.client = new Client();
    this.query = {};

    if (typeof name !== "undefined") {
      this.whereName(name);
    }
  }

  whereName(name) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `In whereName, parameter should be a string (workflow's name) - not a "${typeof name}"`,
      );
    }
    this.query.name = name;

    return this;
  }

  whereId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new InvalidArgumentError(
        `In whereId, parameter should be a string or an integer - not a "${typeof id}"`,
      );
    }
    this.query.customId = id.toString();

    return this;
  }

  whereZenatonId(zenatonId) {
    if (typeof zenatonId !== "string" && !Number.isInteger(zenatonId)) {
      throw new InvalidArgumentError(
        `In whereZid, parameter should be a string or an integer - not a "${typeof zenatonId}"`,
      );
    }
    this.query.zenatonId = zenatonId.toString();

    return this;
  }

  /**
   * Retrieve an instance
   */
  async find() {
    return this.client.findWorkflow(this);
  }

  /**
   * Send an event to a workflow instance
   */
  async send(eventName, eventData = {}) {
    return this.client.sendEvent(this, eventName, eventData);
  }

  /**
   * Kill a workflow instance
   */
  async kill() {
    return this.client.killWorkflow(this);
  }

  /**
   * Pause a workflow instance
   */
  async pause() {
    return this.client.pauseWorkflow(this);
  }

  /**
   * Resume a workflow instance
   */
  async resume() {
    return this.client.resumeWorkflow(this);
  }

  _name() {
    return this.query.name;
  }

  _customId() {
    return this.query.customId;
  }

  _zenatonId() {
    return this.query.zenatonId;
  }
};

module.exports = WorkflowQuery;
