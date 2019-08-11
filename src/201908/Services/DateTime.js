const moment = require("moment-timezone");
const objectify = require("../Services/Objectify");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const duration = require("./Duration");

class DateTime {
  constructor() {
    this.duration = duration.seconds(0);
    this.timestamp = null;
    this.definition = {};

    return this;
  }

  timestamp(timestamp) {
    if (!Number.isInteger(timestamp)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.timestamp()" must be an integer`,
      );
    }

    this.timestamp = timestamp;
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

  monday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.monday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [1, count];
    return this;
  }

  tuesday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.tuesday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [2, count];
    return this;
  }

  wednesday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.wednesday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [3, count];
    return this;
  }

  thursday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.thursday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [4, count];
    return this;
  }

  friday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        `Parameter of "DateTime.friday()" must be an integer`,
      );
    }
    this.definition.dayOfWeek = [5, count];
    return this;
  }

  saturday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'DateTime.saturday' must be an integer",
      );
    }
    this.definition.dayOfWeek = [6, count];
    return this;
  }

  sunday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'DateTime.sunday' must be an integer",
      );
    }
    this.definition.dayOfWeek = [7, count];
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

  _get() {
    if (Number.isInteger(this.timestamp)) {
      return this.timestamp;
    }

    const now = moment();
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
