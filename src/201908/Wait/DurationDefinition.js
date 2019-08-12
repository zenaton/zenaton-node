const moment = require("moment-timezone");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");

const durationChecker = /^\d+:\d+:\d+:\d+:\d+:\d+:\d+$/;
const periodsForCompute = ["s", "m", "h", "d", "w", "M", "y"];

const SECONDS_INDEX = 0;
const MINUTES_INDEX = 1;
const HOURS_INDEX = 2;
const DAYS_INDEX = 3;
const WEEKS_INDEX = 4;
const MONTHS_INDEX = 5;
const YEARS_INDEX = 6;

class DurationDefinition {
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

    this.duration[SECONDS_INDEX] = seconds;
    return this;
  }

  minutes(minutes) {
    if (!Number.isInteger(minutes)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.minutes' must be an integer",
      );
    }

    this.duration[MINUTES_INDEX] = minutes;
    return this;
  }

  hours(hours) {
    if (!Number.isInteger(hours)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.hours' must be an integer",
      );
    }

    this.duration[HOURS_INDEX] = hours;
    return this;
  }

  days(days) {
    if (!Number.isInteger(days)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.days' must be an integer",
      );
    }

    this.duration[DAYS_INDEX] = days;
    return this;
  }

  weeks(weeks) {
    if (!Number.isInteger(weeks)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.weeks' must be an integer",
      );
    }

    this.duration[WEEKS_INDEX] = weeks;
    return this;
  }

  months(months) {
    if (!Number.isInteger(months)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.months' must be an integer",
      );
    }

    this.duration[MONTHS_INDEX] = months;
    return this;
  }

  years(years) {
    if (!Number.isInteger(years)) {
      throw new InvalidArgumentError(
        "Parameter of 'duration.years' must be an integer",
      );
    }

    this.duration[YEARS_INDEX] = years;
    return this;
  }

  get() {
    return this.duration.join(":");
  }
}

module.exports = () => new DurationDefinition();

module.exports.compute = (durationDefinition, baseDate) =>
  Number.isInteger(durationDefinition)
    ? durationDefinition
    : (() => {
        if (!durationChecker.test(durationDefinition)) {
          throw new InvalidArgumentError(
            "Parameter of 'Duration.compute' must be an integer or a well formated string",
          );
        }

        const duration = durationDefinition.split(":");

        const now = moment(baseDate);
        const date = now.clone();

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < duration.length; i++) {
          date.add(parseInt(duration[i], 10), periodsForCompute[i]);
        }

        return date.diff(now, "seconds");
      })();
