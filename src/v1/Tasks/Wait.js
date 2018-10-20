const { InvalidArgumentError } = require("../../Errors");
const Task = require("./Task");
const Trait = require("../Services/Trait");
const WithTimestamp = require("../Traits/WithTimestamp");
const moment = require("moment-timezone");

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
    //
  },
});

// 	static method can not be defined by trait :(
WaitClass.timezone = function(timezone) {
  if (moment.tz.names().indexOf(timezone) < 0) {
    throw new InvalidArgumentError("Unknown timezone");
  }

  this._timezone = timezone;
};

module.exports = Trait.apply(WaitClass, WithTimestamp);
