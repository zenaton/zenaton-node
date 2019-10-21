const moment = require("moment-timezone");
const objectify = require("./Objectify");
const { ExternalZenatonError } = require("../../../Errors");
const Duration = require("./Duration");

const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;

let defaultTimezone = "UTC";

class DateTime {
  constructor() {
    this.duration = Duration.seconds(0);
    this.ts = null;
    this.definition = {};
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

  timestamp(timestamp) {
    if (!Number.isInteger(timestamp)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.timestamp()" must be an integer`,
      );
    }

    this.ts = timestamp;
    return this;
  }

  at(time) {
    if (typeof time !== "string") {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.at()" must be a string`,
      );
    }

    this.definition.at = time;
    return this;
  }

  dayOfMonth(day) {
    if (!Number.isInteger(day)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.dayOfMonth()" must be an integer`,
      );
    }
    this.definition.dayOfMonth = day;
    return this;
  }

  monday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.monday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [MONDAY, count];
    return this;
  }

  tuesday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.tuesday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [TUESDAY, count];
    return this;
  }

  wednesday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.wednesday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [WEDNESDAY, count];
    return this;
  }

  thursday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.thursday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [THURSDAY, count];
    return this;
  }

  friday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        `Parameter of "DateTime.friday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [FRIDAY, count];
    return this;
  }

  saturday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        "Parameter of 'DateTime.saturday' must be an integer",
      );
    }
    this.definition.dayOfWeek = [SATURDAY, count];
    return this;
  }

  sunday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new ExternalZenatonError(
        "Parameter of 'DateTime.sunday' must be an integer",
      );
    }
    this.definition.dayOfWeek = [SUNDAY, count];
    return this;
  }

  seconds(seconds) {
    this.duration.seconds(seconds);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  minutes(minutes) {
    this.duration.minutes(minutes);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  hours(hours) {
    this.duration.hours(hours);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  days(days) {
    this.duration.days(days);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  weeks(weeks) {
    this.duration.weeks(weeks);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  months(months) {
    this.duration.months(months);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  years(years) {
    this.duration.years(years);
    this.definition.duration = this.duration._getDefinition();
    return this;
  }

  get(definition, baseDate) {
    if (definition === null) return null;

    const timeDefinition = definition || this._getDefinition();

    if (Number.isInteger(timeDefinition)) {
      return timeDefinition;
    }

    const now = moment(baseDate).tz(timeDefinition.timezone);
    const date = now.clone();

    // we add a duration to current date if specified
    if (timeDefinition.duration) {
      const duration = Duration.get(timeDefinition.duration, baseDate);
      date.add(duration, "s");
    }

    // we set time to execute if specified
    if (timeDefinition.at) {
      const segments = timeDefinition.at.split(":");

      const h = parseInt(segments[0], 10);
      const m = segments.length > 1 ? parseInt(segments[1], 10) : 0;
      const s = segments.length > 2 ? parseInt(segments[2], 10) : 0;

      date.set({ hour: h, minute: m, second: s });
    }

    // if day of month, we compute and return timestamp
    if (timeDefinition.dayOfMonth) {
      date.set("date", timeDefinition.dayOfMonth);

      return now.isAfter(date) ? date.add(1, "M").unix() : date.unix();
    }

    // if day of week, we compute and return timestamp
    if (timeDefinition.dayOfWeek) {
      const dayToProcess = timeDefinition.dayOfWeek[0];
      const numberOfWeeks = timeDefinition.dayOfWeek[1];
      const d = date.isoWeekday();

      date.add(dayToProcess - d, "days");

      // eslint-disable-next-line no-unused-expressions
      d > dayToProcess
        ? date.add(numberOfWeeks, "weeks")
        : date.add(numberOfWeeks - 1, "weeks");

      return now.isAfter(date) ? date.add(1, "w").unix() : date.unix();
    }

    // else, we return timestamps
    return now.isAfter(date) ? date.add(1, "d").unix() : date.unix();
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
    return this.ts ? this.ts : this.definition;
  }
}

module.exports = objectify(DateTime);
