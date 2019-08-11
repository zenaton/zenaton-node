const moment = require("moment-timezone");
const objectify = require("../Services/Objectify");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");

const periodsForCompute = ["s", "m", "h", "d", "w", "M", "y"];

class Duration {
  constructor() {
    this.duration = [0, 0, 0, 0, 0, 0, 0];

    return this;
  }

  seconds(seconds) {
    if (!Number.isInteger(seconds)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.seconds' must be an integer",
      );
    }

    this.duration[0] = seconds;
    return this;
  }

  minutes(minutes) {
    if (!Number.isInteger(minutes)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.minutes' must be an integer",
      );
    }

    this.duration[1] = minutes;
    return this;
  }

  hours(hours) {
    if (!Number.isInteger(hours)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.hours' must be an integer",
      );
    }

    this.duration[2] = hours;
    return this;
  }

  days(days) {
    if (!Number.isInteger(days)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.days' must be an integer",
      );
    }

    this.duration[3] = days;
    return this;
  }

  weeks(weeks) {
    if (!Number.isInteger(weeks)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.weeks' must be an integer",
      );
    }

    this.duration[4] = weeks;
    return this;
  }

  months(months) {
    if (!Number.isInteger(months)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.months' must be an integer",
      );
    }

    this.duration[5] = months;
    return this;
  }

  years(years) {
    if (!Number.isInteger(years)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.years' must be an integer",
      );
    }

    this.duration[6] = years;
    return this;
  }

  _get() {
    const now = moment();
    const date = now.clone();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.duration.length; i++) {
      date.add(parseInt(this.duration[i], 10), periodsForCompute[i]);
    }

    return date.diff(now, "seconds");
  }
}

module.exports = objectify(Duration);
