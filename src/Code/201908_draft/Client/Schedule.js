const uuidv4 = require("uuid/v4");
const versioner = require("../Services/Versioner");
const { ExternalZenatonError } = require("../../../Errors");

const MAX_ID_SIZE = 256;

const Schedule = class Schedule {
  constructor(processor) {
    this.name = null;
    this.input = null;
    this.options = null;
    this.customId = null;
    this.intentId = uuidv4();
    this.promise = null;

    this._processor = processor;
  }

  each(cron) {
    if (typeof cron !== "string" || cron === "") {
      throw new ExternalZenatonError(
        "Param passed to 'schedule' function must be a non empty string",
      );
    }

    this.scheduling = this.scheduling || {};
    this.scheduling.cron = cron;

    return this;
  }

  withId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withId" must be a string or an integer - not a "${typeof id}"`,
      );
    }
    if (id.toString().length >= MAX_ID_SIZE) {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withId" must not exceed ${MAX_ID_SIZE} bytes`,
      );
    }
    this.customId = id.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new ExternalZenatonError(
        `Parameter of "dispatch.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this.options = options;

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
    const { canonical } = versioner(name);
    this.type = "task";
    this.name = name;
    this.input = input;
    this.canonical = canonical;
    return this._processor.scheduleTask(this._getJob());
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
    const { canonical } = versioner(name);
    this.type = "workflow";
    this.input = input;
    this.name = name;
    this.canonical = canonical;
    this.promise = await this._processor.scheduleWorkflow(this._getJob());

    return this;
  }

  _getJob() {
    return {
      type: this.type,
      name: this.name,
      canonical: this.canonical,
      input: this.input,
      options: this.options,
      customId: this.customId,
      intentId: this.intentId,
      promise: this.promise,
      scheduling: this.scheduling,
    };
  }
};

module.exports = Schedule;
