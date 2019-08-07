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
    this.duration = 60 * 60 * 24 * 365 * 100 + 7734;

    return this.apply();
  }

  for(duration) {
    if (!Number.isInteger(duration)) {
      throw new InvalidArgumentError(
        "First parameter of 'wait.for' must be an integer (wait's duration)",
      );
    }
    this.duration = duration;

    return this.apply();
  }

  until(timestamp) {
    if (!Number.isInteger(timestamp)) {
      throw new InvalidArgumentError(
        "First parameter of 'wait.until' must be an integer (wait's timestamp",
      );
    }
    this.timestamp = timestamp;

    return this.apply();
  }

  event(event, filter = null) {
    this.events.push([event, filter]);

    return this;
  }

  async apply() {
    const event = this.events.length > 0 ? this.events[0][0] : null;

    return new Engine().executeTask("zenaton:wait", {
      event,
      duration: this.duration,
      timestamp: this.timestamp,
    });
  }
}

module.exports = () => new WaitDefinition();
