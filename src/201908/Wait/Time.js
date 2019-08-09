const TimeDefinition = require("./TimeDefinition");

module.exports = class Time {
  static timestamp(timestamp) {
    return TimeDefinition().timestamp(timestamp);
  }

  static at(time) {
    return TimeDefinition().at(time);
  }

  static dayOfMonth(day) {
    return TimeDefinition().dayOfMonth(day);
  }

  static monday(count) {
    return TimeDefinition().monday(count);
  }

  static tuesday(count) {
    return TimeDefinition().tuesday(count);
  }

  static wednesday(count) {
    return TimeDefinition().wednesday(count);
  }

  static thursday(count) {
    return TimeDefinition().thursday(count);
  }

  static friday(count) {
    return TimeDefinition().friday(count);
  }

  static saturday(count) {
    return TimeDefinition().saturday(count);
  }

  static sunday(count) {
    return TimeDefinition().sunday(count);
  }

  // duration methods in Time
  static seconds(seconds) {
    return TimeDefinition().seconds(seconds);
  }

  static minutes(minutes) {
    return TimeDefinition().minutes(minutes);
  }

  static hours(hours) {
    return TimeDefinition().hours(hours);
  }

  static days(days) {
    return TimeDefinition().days(days);
  }

  static weeks(weeks) {
    return TimeDefinition().weeks(weeks);
  }

  static months(months) {
    return TimeDefinition().months(months);
  }

  static years(years) {
    return TimeDefinition().years(years);
  }

  static compute(timeDefinition) {
    return TimeDefinition.compute(timeDefinition);
  }
};
