const uuidv4 = require("uuid/v4");
const { InvalidArgumentError } = require("../../Errors");
const client = require("./Client");

const Select = class Select {
  constructor() {
    this.type = null;
    this.name = null;
    this.customId = null;
    this.intentId = uuidv4();
  }

  workflow(name) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `In "select.workflow()", parameter should be a string - not a "${typeof name}"`,
      );
    }
    this.type = "workflow";
    this.name = name;

    return this;
  }

  whereId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new InvalidArgumentError(
        `In "select.whereId()", parameter should be a string or an integer - not a "${typeof id}"`,
      );
    }
    this.customId = id.toString();

    return this;
  }

  whereZenatonId(intentId) {
    if (typeof intentId !== "string" && !Number.isInteger(intentId)) {
      throw new InvalidArgumentError(
        `In "select.whereZenatonId", parameter should be a string or an integer - not a "${typeof intentId}"`,
      );
    }
    this.intentId = intentId.toString();

    return this;
  }

  /**
   * Send an event to a workflow instance
   */
  async send(eventName, eventData = {}) {
    return client.sendEvent(this._getQuery(), eventName, eventData);
  }

  /**
   * Kill a workflow instance
   */
  async kill() {
    return client.killWorkflow(this._getQuery());
  }

  /**
   * Pause a workflow instance
   */
  async pause() {
    return client.pauseWorkflow(this._getQuery());
  }

  /**
   * Resume a workflow instance
   */
  async resume() {
    return client.resumeWorkflow(this._getQuery());
  }

  _getQuery() {
    return {
      type: this.type,
      name: this.name,
      input: this.input,
      options: this.options,
      customId: this.customId,
      intentId: this.intentId,
    };
  }
};

module.exports = Select;
