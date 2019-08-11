const uuidv4 = require("uuid/v4");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const client = require("../Client/Client");

const Wait = class Wait {
  constructor() {
    this.eventName = null;
    this.timestamp = null;
    this.duration = null;

    return this;
  }

  forever() {
    this.duration = null;

    return this._apply();
  }

  for(duration) {
    if (
      !Number.isInteger(duration) &&
      typeof duration !== "object" &&
      duration.constructor.name !== "Duration"
    ) {
      throw new InvalidArgumentError(
        `Parameter of "wait.for()" must be an integer or a "duration" object`,
      );
    }
    this.duration = Number.isInteger(duration) ? duration : duration._get();

    return this._apply();
  }

  until(timestamp) {
    if (
      !Number.isInteger(timestamp) &&
      typeof duration !== "object" &&
      timestamp.constructor.name !== "DateTime"
    ) {
      throw new InvalidArgumentError(
        `Parameter of "wait.until()" must be a integer (timestamp) or a DateTime object`,
      );
    }
    this.timestamp = Number.isInteger(timestamp) ? timestamp : timestamp._get();

    return this._apply();
  }

  event(eventName) {
    this.eventName = eventName;

    return this;
  }

  async _apply() {
    return client.executeTask(this._getWait());
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
      intentId: uuidv4(),
    };
  }
};

module.exports = Wait;
