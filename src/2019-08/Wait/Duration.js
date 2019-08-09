const DurationDefinition = require("./DurationDefinition");

module.exports = class Duration {
  static seconds(seconds) {
    return DurationDefinition().seconds(seconds);
  }

  static minutes(minutes) {
    return DurationDefinition().minutes(minutes);
  }

  static hours(hours) {
    return DurationDefinition().hours(hours);
  }

  static days(days) {
    return DurationDefinition().days(days);
  }

  static weeks(weeks) {
    return DurationDefinition().weeks(weeks);
  }

  static months(months) {
    return DurationDefinition().months(months);
  }

  static years(years) {
    return DurationDefinition().years(years);
  }

  static compute(durationDefinition) {
    return DurationDefinition.compute(durationDefinition);
  }
};
