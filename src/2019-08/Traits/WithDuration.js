const moment = require("moment-timezone");
const { InternalZenatonError } = require("../../Errors");

module.exports = {
  _getDuration() {
    if (undefined === this.data._buffer) {
      return null;
    }

    const now = this._initNow();
    let then = moment(now);

    this.data._buffer.forEach((call) => {
      then = this._applyDuration(call[0], call[1], then);
    });

    return then.diff(now, "seconds");
  },

  seconds(value = 1) {
    this._push(["seconds", value]);

    return this;
  },

  minutes(value = 1) {
    this._push(["minutes", value]);

    return this;
  },

  hours(value = 1) {
    this._push(["hours", value]);

    return this;
  },

  days(value = 1) {
    this._push(["days", value]);

    return this;
  },

  weeks(value = 1) {
    this._push(["weeks", value]);

    return this;
  },

  months(value = 1) {
    this._push(["months", value]);

    return this;
  },

  years(value = 1) {
    this._push(["years", value]);

    return this;
  },

  _initNow() {
    // get setted or current time zone
    const tz =
      undefined !== this.constructor._timezone
        ? this.constructor._timezone
        : moment.tz.guess();

    const now = moment().tz(tz);

    return now;
  },

  _push(instruction) {
    if (undefined === this.data._buffer) {
      this.data._buffer = [];
    }
    this.data._buffer.push(instruction);
  },

  _applyDuration(method, value, then) {
    switch (method) {
      case "seconds":
        return then.add(value, "seconds");
      case "minutes":
        return then.add(value, "minutes");
      case "hours":
        return then.add(value, "hours");
      case "days":
        return then.add(value, "days");
      case "weeks":
        return then.add(value, "weeks");
      case "months":
        return then.add(value, "months");
      case "years":
        return then.add(value, "years");
      default:
        throw new InternalZenatonError(`Unknown methods ${method}`);
    }
  },
};
