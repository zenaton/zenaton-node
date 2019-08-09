const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const Engine = require("../Engine");

class WaitDefinition {
  constructor() {
    this.events = [];
    this.timestamp = null;
    this.duration = null;

    return this;
  }

  forever() {
    this.duration = null;

    return this.apply();
  }

  for(duration) {
    if (
      !Number.isInteger(duration) &&
      typeof duration !== "object" &&
      duration.constructor.name !== "DurationDefinition"
    ) {
      throw new InvalidArgumentError(
        "First parameter of 'wait.for' must be an integer or a Duration object",
      );
    }
    this.duration = Number.isInteger(duration) ? duration : duration.get();

    return this.apply();
  }

  until(timestamp) {
    if (
      !Number.isInteger(timestamp) &&
      typeof duration !== "object" &&
      timestamp.constructor.name !== "TimeDefinition"
    ) {
      throw new InvalidArgumentError(
        "First parameter of 'wait.for' must be an integer or a Date object",
      );
    }
    this.timestamp = Number.isInteger(timestamp) ? timestamp : timestamp.get();

    return this.apply();
  }

  event(event) {
    this.event = event;

    return this;
  }

  async apply() {
    return new Engine().executeTask("zenaton:wait", {
      event: this.event,
      duration: this.duration,
      timestamp: this.timestamp,
    });
  }
}

module.exports = () => new WaitDefinition();
