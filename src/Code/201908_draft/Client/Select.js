const { ExternalZenatonError } = require("../../../Errors");

const Select = class Select {
  constructor(processor) {
    this.type = null;
    this.name = null;
    this.customId = null;
    this.intentId = null;

    this._processor = processor;
  }

  workflow(name) {
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `In "select.workflow()", parameter should be a string - not a "${typeof name}"`,
      );
    }
    this.type = "workflow";
    this.name = name;

    return this;
  }

  whereId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new ExternalZenatonError(
        `In "select.whereId()", parameter should be a string or an integer - not a "${typeof id}"`,
      );
    }
    this.customId = id.toString();

    return this;
  }

  whereZenatonId(intentId) {
    if (typeof intentId !== "string" && !Number.isInteger(intentId)) {
      throw new ExternalZenatonError(
        `In "select.whereZenatonId", parameter should be a string or an integer - not a "${typeof intentId}"`,
      );
    }
    this.intentId = intentId.toString();

    return this;
  }

  /**
   * Send an event to a workflow instance
   */
  async send(eventName, ...eventData) {
    if (!this._processor.sendEvent) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "send" syntax from here`,
      );
    }
    return this._processor.sendEvent(this._getQuery(), eventName, eventData);
  }

  /**
   * Kill a workflow instance
   */
  async kill() {
    if (!this._processor.killWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "kill" syntax from here`,
      );
    }
    return this._processor.killWorkflow(this._getQuery());
  }

  /**
   * Pause a workflow instance
   */
  async pause() {
    if (!this._processor.pauseWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "pause" syntax from here`,
      );
    }
    return this._processor.pauseWorkflow(this._getQuery());
  }

  /**
   * Resume a workflow instance
   */
  async resume() {
    if (!this._processor.resumeWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "resume" syntax from here`,
      );
    }
    return this._processor.resumeWorkflow(this._getQuery());
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
