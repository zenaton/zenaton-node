const moment = require("moment-timezone");
const objectify = require("./Objectify");
const { ExternalZenatonError } = require("../../../Errors");

const periodsForCompute = ["s", "m", "h", "d", "w", "M", "y"];

const SECONDS_INDEX = 0;
const MINUTES_INDEX = 1;
const HOURS_INDEX = 2;
const DAYS_INDEX = 3;
const WEEKS_INDEX = 4;
const MONTHS_INDEX = 5;
const YEARS_INDEX = 6;

let defaultTimezone = "UTC";

class Duration {
  constructor() {
    this.definition = {};
    this.definition.duration = [0, 0, 0, 0, 0, 0, 0];
    this.definition.timezone = defaultTimezone;

    return this;
  }

  timezone(timezone) {
    if (moment.tz.names().indexOf(timezone) < 0) {
      throw new ExternalZenatonError("Unknown timezone");
    }

    this.definition.timezone = timezone;

    return this;
  }

  seconds(seconds) {
    if (!Number.isInteger(seconds)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.seconds' must be an integer",
      );
    }

    this.definition.duration[SECONDS_INDEX] = seconds;
    return this;
  }

  minutes(minutes) {
    if (!Number.isInteger(minutes)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.minutes' must be an integer",
      );
    }

    this.definition.duration[MINUTES_INDEX] = minutes;
    return this;
  }

  hours(hours) {
    if (!Number.isInteger(hours)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.hours' must be an integer",
      );
    }

    this.definition.duration[HOURS_INDEX] = hours;
    return this;
  }

  days(days) {
    if (!Number.isInteger(days)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.days' must be an integer",
      );
    }

    this.definition.duration[DAYS_INDEX] = days;
    return this;
  }

  weeks(weeks) {
    if (!Number.isInteger(weeks)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.weeks' must be an integer",
      );
    }

    this.definition.duration[WEEKS_INDEX] = weeks;
    return this;
  }

  months(months) {
    if (!Number.isInteger(months)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.months' must be an integer",
      );
    }

    this.definition.duration[MONTHS_INDEX] = months;
    return this;
  }

  years(years) {
    if (!Number.isInteger(years)) {
      throw new ExternalZenatonError(
        "Parameter of 'duration.years' must be an integer",
      );
    }

    this.definition.duration[YEARS_INDEX] = years;
    return this;
  }

  get(definition, baseDate) {
    if (definition === null) return null;

    const durationDefinition = definition || this._getDefinition();

    if (Number.isInteger(durationDefinition)) {
      return durationDefinition;
    }

    const { duration } = durationDefinition;

    const now = moment(baseDate).tz(durationDefinition.timezone);
    const date = now.clone();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < duration.length; i++) {
      date.add(parseInt(duration[i], 10), periodsForCompute[i]);
    }

    return date.diff(now, "seconds");
  }

  setDefaultTimezone(timezone) {
    if (moment.tz.names().indexOf(timezone) < 0) {
      throw new ExternalZenatonError("Unknown timezone");
    }

    defaultTimezone = timezone;
  }

  getDefaultTimezone() {
    return defaultTimezone;
  }

  _getDefinition() {
    return this.definition;
  }
}

module.exports = objectify(Duration);
