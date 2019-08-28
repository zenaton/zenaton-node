const uuidv4 = require("uuid/v4");
const InvalidArgumentError = require("../../../Errors/InvalidArgumentError");
const versioner = require("../Services/Versioner");

const MAX_ID_SIZE = 256;

const Schedule = class Schedule {
  constructor() {
    this.name = null;
    this.input = null;
    this.options = null;
    this.customId = null;
    this.intentId = uuidv4();
    this.promise = null;

    return this;
  }

  set processor(processor) {
    this._processor = processor;
    return this;
  }

  each(cron) {
    if (typeof cron !== "string" || cron === "") {
      throw new InvalidArgumentError(
        "Param passed to 'schedule' function must be a non empty string",
      );
    }

    this.scheduling = this.scheduling || {};
    this.scheduling.cron = cron;

    return this;
  }

  withId(id) {
    if (typeof id !== "string" && !Number.isInteger(id)) {
      throw new InvalidArgumentError(
        `Parameter of "dispatch.withId" must be a string or an integer - not a "${typeof id}"`,
      );
    }
    if (id.toString().length >= MAX_ID_SIZE) {
      throw new InvalidArgumentError(
        `Parameter of "dispatch.withId" must not exceed ${MAX_ID_SIZE} bytes`,
      );
    }
    this.customId = id.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new InvalidArgumentError(
        `Parameter of "dispatch.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this.options = options;

    return this;
  }

  async task(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `First parameter of Parameter "shedule.task" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new InvalidArgumentError(
        `First parameter of Parameter "dispatch.task" should be a non-empty string`,
      );
    }
    this.type = "task";
    this.name = name;
    this.input = input;
    return this._processor.scheduleTask(this._getJob());
  }

  async workflow(name, ...input) {
    if (typeof name !== "string") {
      throw new InvalidArgumentError(
        `First parameter of Parameter "schedule.workflow" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new InvalidArgumentError(
        `First parameter of Parameter "dispatch.workflow" should be a non-empty string`,
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
