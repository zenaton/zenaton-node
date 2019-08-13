const moment = require("moment-timezone");
const objectify = require("../Services/Objectify");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const duration = require("./Duration");

const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;

class DateTime {
  constructor() {
    this.duration = duration.seconds(0);
    this.ts = null;
    this.definition = {};

    return this;
  }

  timestamp(timestamp) {
    if (!Number.isInteger(timestamp)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.timestamp()" must be an integer`,
      );
    }

    this.ts = timestamp;
    return this;
  }

  at(time) {
    if (typeof time !== "string") {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.at()" must be a string`,
      );
    }

    this.definition.at = time;
    return this;
  }

  dayOfMonth(day) {
    if (!Number.isInteger(day)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.dayOfMonth()" must be an integer`,
      );
    }
    this.definition.dayOfMonth = day;
    return this;
  }

  monday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.monday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [MONDAY, count];
    return this;
  }

  tuesday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.tuesday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [TUESDAY, count];
    return this;
  }

  wednesday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.wednesday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [WEDNESDAY, count];
    return this;
  }

  thursday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.thursday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [THURSDAY, count];
    return this;
  }

  friday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.friday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [FRIDAY, count];
    return this;
  }

  saturday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'DateTime.saturday' must be an integer",
      );
    }
    this.definition.dayOfWeek = [SATURDAY, count];
    return this;
  }

  sunday(count = 1) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'DateTime.sunday' must be an integer",
      );
    }
    this.definition.dayOfWeek = [SUNDAY, count];
    return this;
  }

  seconds(seconds) {
    this.duration.seconds(seconds);
    return this;
  }

  minutes(minutes) {
    this.duration.minutes(minutes);
    return this;
  }

  hours(hours) {
    this.duration.hours(hours);
    return this;
  }

  days(days) {
    this.duration.days(days);
    return this;
  }

  weeks(weeks) {
    this.duration.weeks(weeks);
    return this;
  }

  months(months) {
    this.duration.months(months);
    return this;
  }

  years(years) {
    this.duration.years(years);
    return this;
  }

  _get(baseDate) {
    if (Number.isInteger(this.ts)) {
      return this.ts;
    }

    const now = moment(baseDate);
    const date = now.clone();

    // we add a duration to current date if specified
    date.add(this.duration._get(), "s");

    // we set time to execute if specified
    if (this.definition.at) {
      const segments = this.definition.at.split(":");

      const h = parseInt(segments[0], 10);
      const m = segments.length > 1 ? parseInt(segments[1], 10) : 0;
      const s = segments.length > 2 ? parseInt(segments[2], 10) : 0;

      date.set({ hour: h, minute: m, second: s });
    }

    // if day of month, we compute and return timestamp
    if (this.definition.dayOfMonth) {
      date.set("date", this.definition.dayOfMonth);

      return now.isAfter(date) ? date.add(1, "M").unix() : date.unix();
    }

    // if day of week, we compute and return timestamp
    if (this.definition.dayOfWeek) {
      const dayToProcess = this.definition.dayOfWeek[0];
      const numberOfWeeks = this.definition.dayOfWeek[1];
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
}

module.exports = objectify(DateTime);
