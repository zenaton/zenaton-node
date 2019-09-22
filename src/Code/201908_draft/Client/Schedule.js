const { ExternalZenatonError } = require("../../../Errors");

const MAX_ID_SIZE = 256;

const Schedule = class Schedule {
  constructor(cron, processor) {
    if (typeof cron !== "string" || cron === "") {
      throw new ExternalZenatonError(
        `Parameter of "schedule" must be a non empty string`,
      );
    }
    this._scheduling = { cron };
    this._processor = processor;
  }

  withTag(tag) {
    if (typeof tag !== "string" && !Number.isInteger(tag)) {
      throw new ExternalZenatonError(
        `Parameter of "schedule.withTag" must be a string or an integer - not a "${typeof tag}"`,
      );
    }
    if (tag.toString().length >= MAX_ID_SIZE) {
      throw new ExternalZenatonError(
        `Parameter of "schedule.withTag" must not exceed ${MAX_ID_SIZE} bytes`,
      );
    }
    this._customId = tag.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this._options = options;

    return this;
  }

  async task(name, ...input) {
    if (!this._processor.scheduleTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "schedule.task" syntax from here`,
      );
    }
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `First parameter of Parameter "schedule.task" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new ExternalZenatonError(
        `First parameter of Parameter "schedule.task" should be a non-empty string`,
      );
    }

    return this._processor.scheduleTask(this._getJob(name, ...input));
  }

  async workflow(name, ...input) {
    if (!this._processor.scheduleWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "schedule.workflow" syntax from here`,
      );
    }
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `First parameter of Parameter "schedule.workflow" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new ExternalZenatonError(
        `First parameter of Parameter "schedule.workflow" should be a non-empty string`,
      );
    }

    return this._processor.scheduleWorkflow(this._getJob(name, ...input));
  }

  _getJob(name, ...input) {
    return {
      name,
      input,
      options: this._options,
      customId: this._customId,
      scheduling: this._scheduling,
    };
  }
};

module.exports = Schedule;
