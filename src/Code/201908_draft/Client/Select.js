const { ExternalZenatonError } = require("../../../Errors");

const Select = class Select {
  constructor(processor) {
    this._processor = processor;
  }

  workflow(name) {
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `In "select.workflow()", parameter should be a string - not a "${typeof name}"`,
      );
    }
    this._type = "workflow";
    this._name = name;

    return this;
  }

  withTag(tag) {
    if (typeof tag !== "string" && !Number.isInteger(tag)) {
      throw new ExternalZenatonError(
        `In "select.withTag()", parameter should be a string or an integer - not a "${typeof tag}"`,
      );
    }
    this._customId = tag.toString();

    return this;
  }

  withId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new ExternalZenatonError(
        `In "select.withId", parameter should be a string or an integer - not a "${typeof id}"`,
      );
    }
    this._instanceIntentId = id.toString();

    return this;
  }

  /**
   * Send an event to a workflow instance
   */
  send(eventName, ...eventData) {
    if (!this._processor.sendEvent) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "send" syntax from here`,
      );
    }

    return this._processor.sendEvent(this._getQuery(), eventName, eventData);
  }

  /**
   * Terminate a workflow instance
   */
  terminate() {
    if (!this._processor.terminateWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "terminate" syntax from here`,
      );
    }

    return this._processor.terminateWorkflow(this._getQuery());
  }

  /**
   * Pause a workflow instance
   */
  pause() {
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
  resume() {
    if (!this._processor.resumeWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "resume" syntax from here`,
      );
    }

    return this._processor.resumeWorkflow(this._getQuery());
  }

  _getQuery() {
    return {
      name: this._name,
      type: this._type,
      customId: this._customId,
      instanceIntentId: this._instanceIntentId,
    };
  }
};

module.exports = Select;
