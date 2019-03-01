const moment = require("moment-timezone");
const { InvalidArgumentError } = require("../../Errors");
const Task = require("./Task");
const { Trait } = require("../Services");
const WithTimestamp = require("../Traits/WithTimestamp");

const WaitClass = Task("_Wait", {
  init(event = null) {
    if (event !== null && typeof event !== "string") {
      throw new InvalidArgumentError(
        "1st parameter, if any, must be a string (event name)",
      );
    }
    this.event = event;
  },
  handle() {
    // No waiting when executed locally
  },
});

// 	static method can not be defined by trait :(
WaitClass.timezone = function timezoneFunc(timezone) {
  if (moment.tz.names().indexOf(timezone) < 0) {
    throw new InvalidArgumentError("Unknown timezone");
  }

  this._timezone = timezone;
};

module.exports = Trait.apply(WaitClass, WithTimestamp);
