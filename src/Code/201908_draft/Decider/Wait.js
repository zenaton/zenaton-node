const InvalidArgumentError = require("../../../Errors/InvalidArgumentError");

const defaultTimezone = "UTC";

const Wait = class Wait {
  constructor() {
    this.eventName = null;
    this.timestamp = null;
    this.duration = null;
    this.timezone = defaultTimezone;

    return this;
  }

  set processor(processor) {
    this._processor = processor;
    return this;
  }

  forever() {
    this.duration = null;

    return this._apply();
  }

  for(duration) {
    if (!Number.isInteger(duration)) {
      if (
        typeof duration !== "object" ||
        duration.constructor.name !== "Duration"
      ) {
        throw new InvalidArgumentError(
          `Parameter of "wait.for()" must be an integer or a "Duration" object`,
        );
      }
    }

    this.duration = Number.isInteger(duration)
      ? duration
      : duration._getDefinition();

    return this._apply();
  }

  until(timestamp) {
    if (!Number.isInteger(timestamp)) {
      if (
        typeof timestamp !== "object" ||
        timestamp.constructor.name !== "DateTime"
      ) {
        throw new InvalidArgumentError(
          `Parameter of "wait.until()" must be a timestamp or a "DateTime" object`,
        );
      }
    }

    this.timestamp = Number.isInteger(timestamp)
      ? timestamp
      : timestamp._getDefinition();

    return this._apply();
  }

  event(eventName) {
    this.eventName = eventName;

    return this;
  }

  async _apply() {
    return this._processor.executeTask(this._getWait());
  }

  _getWait() {
    return {
      type: "wait",
      name: "_Wait",
      input: {
        event: this.eventName,
        duration: this.duration,
        timestamp: this.timestamp,
      },
    };
  }
};

module.exports = Wait;
