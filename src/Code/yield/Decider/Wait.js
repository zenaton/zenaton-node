const moment = require("moment-timezone");
const { ExternalZenatonError } = require("../../../Errors");

const Wait = class Wait {
  constructor(processor) {
    this.eventName = null;
    this.timestamp = null;
    this.duration = null;

    this._processor = processor;
  }

  forever() {
    // http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
    this.timestamp = 8640000000;

    return this._apply();
  }

  for(duration) {
    if (!Number.isInteger(duration)) {
      if (
        typeof duration !== "object" ||
        duration.constructor.name !== "Duration"
      ) {
        throw new ExternalZenatonError(
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
        throw new ExternalZenatonError(
          `Parameter of "wait.until()" must be a timestamp or a "DateTime" object`,
        );
      }
    }

    this.timestamp = Number.isInteger(timestamp)
      ? timestamp
      : timestamp._getDefinition();

    return this._apply();
  }

  timezone(timezone) {
    if (moment.tz.names().indexOf(timezone) < 0) {
      throw new ExternalZenatonError("Unknown timezone");
    }

    this.timezone = timezone;

    return this;
  }

  event(eventName) {
    this.eventName = eventName;

    return this;
  }

  _apply() {
    if (!this._processor.runWait) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "wait" syntax from here`,
      );
    }
    return this._processor.runWait(this._getWait());
  }

  _getWait() {
    return {
      event: this.eventName,
      duration: this.duration,
      timestamp: this.timestamp,
    };
  }
};

module.exports = Wait;
