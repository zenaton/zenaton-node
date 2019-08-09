const moment = require("moment-timezone");
const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const DurationDefinition = require("./DurationDefinition");

class TimeDefinition {
  constructor() {
    this.Duration = DurationDefinition();

    this.timestamp = null;
    this.definition = {};

    return this;
  }

  timestamp(timestamp) {
    if (!Number.isInteger(timestamp)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.timestamp' must be an integer",
      );
    }

    this.timestamp = timestamp;
    return this;
  }

  at(time) {
    if (typeof time !== "string") {
      throw new InvalidArgumentError("Parameter of 'Date.at' must be a string");
    }

    this.definition.at = time;
    return this;
  }

  dayOfMonth(day) {
    if (!Number.isInteger(day)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.dayOfMonth' must be an integer",
      );
    }

    this.definition.dayOfMonth = day;
    return this;
  }

  monday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [1, count];
    return this;
  }

  tuesday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [2, count];
    return this;
  }

  wednesday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [3, count];
    return this;
  }

  thursday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [4, count];
    return this;
  }

  friday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [5, count];
    return this;
  }

  saturday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [6, count];
    return this;
  }

  sunday(count = 0) {
    if (!Number.isInteger(count)) {
      throw new InvalidArgumentError(
        "Parameter of 'Date.monday' must be an integer",
      );
    }

    this.definition.dayOfWeek = [7, count];
    return this;
  }

  seconds(seconds) {
    this.Duration.seconds(seconds);
    this.definition.duration = this.Duration.get();
    return this;
  }

  minutes(minutes) {
    this.Duration.minutes(minutes);
    this.definition.duration = this.Duration.get();
    return this;
  }

  hours(hours) {
    this.Duration.hours(hours);
    this.definition.duration = this.Duration.get();
    return this;
  }

  days(days) {
    this.Duration.days(days);
    this.definition.duration = this.Duration.get();
    return this;
  }

  weeks(weeks) {
    this.Duration.weeks(weeks);
    this.definition.duration = this.Duration.get();
    return this;
  }

  months(months) {
    this.Duration.months(months);
    this.definition.duration = this.Duration.get();
    return this;
  }

  years(years) {
    this.Duration.years(years);
    this.definition.duration = this.Duration.get();
    return this;
  }

  get() {
    return this.timestamp ? this.timestamp : this.definition;
  }
}

module.exports = () => new TimeDefinition();

module.exports.compute = (timeDefinition) =>
  Number.isInteger(timeDefinition)
    ? timeDefinition
    : (() => {
        const now = moment();
        const date = now.clone();

        // we add a duration to current date if specified
        if (timeDefinition.duration) {
          const duration = DurationDefinition.compute(timeDefinition.duration);
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
      })();
