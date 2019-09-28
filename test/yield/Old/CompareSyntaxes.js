/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const { Trait } = require("../../../src/Code/async/Services");
const WithTimestamp = require("../../../src/Code/async/Traits/WithTimestamp");
const DateTime = require("../../../src/Code/yield/Services/DateTime");
const Duration = require("../../../src/Code/yield/Services/Duration");

const baseDate = "2019-08-09T16:26:44.929Z";

class WaitDummyClass {
  constructor(date) {
    this.data = {};
    this.data._$baseDate = date;
  }
}

WaitDummyClass.timezone = function timezoneFunc(timezone) {
  this._timezone = timezone;
};

const Wait = Trait.apply(WaitDummyClass, WithTimestamp);
Wait.timezone("UTC");

describe("Wait/DateTime old/new implementation simple", () => {
  it("Timestamp", () => {
    const Old = new Wait().timestamp(1234567)._getTimestampOrDuration()[0];
    const New = DateTime.timestamp(1234567)._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Seconds", () => {
    const Old = new Wait(baseDate).seconds(30)._getTimestampOrDuration()[1];
    const New = Duration.seconds(30)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Minutes", () => {
    const Old = new Wait(baseDate).minutes(15)._getTimestampOrDuration()[1];
    const New = Duration.minutes(15)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Hours", () => {
    const Old = new Wait(baseDate).hours(2)._getTimestampOrDuration()[1];
    const New = Duration.hours(2)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Days", () => {
    const Old = new Wait(baseDate).days(1)._getTimestampOrDuration()[1];
    const New = Duration.days(1)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Weeks", () => {
    const Old = new Wait(baseDate).weeks(1)._getTimestampOrDuration()[1];
    const New = Duration.weeks(1)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Months", () => {
    const Old = new Wait(baseDate).months(2)._getTimestampOrDuration()[1];
    const New = Duration.months(2)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Years", () => {
    const Old = new Wait(baseDate).years(10)._getTimestampOrDuration()[1];
    const New = Duration.years(10)._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("Combine durations", () => {
    const Old = new Wait(baseDate)
      .seconds(30)
      .minutes(15)
      .hours(2)
      .days(1)
      .weeks(1)
      .months(2)
      .years(10)
      ._getTimestampOrDuration()[1];
    const New = Duration.seconds(30)
      .minutes(15)
      .hours(2)
      .days(1)
      .weeks(1)
      .months(2)
      .years(10)
      ._getDefinition();

    expect(Duration.get(New, baseDate)).to.be.equals(Old);
  });

  it("At", () => {
    const Old = new Wait(baseDate).at("15:10:23")._getTimestampOrDuration()[0];
    const New = DateTime.at("15:10:23")._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("DayOfMonth", () => {
    const Old = new Wait(baseDate).dayOfMonth(12)._getTimestampOrDuration()[0];
    const New = DateTime.dayOfMonth(12)._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Monday", () => {
    const Old = new Wait(baseDate).monday()._getTimestampOrDuration()[0];
    const New = DateTime.monday()._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Tuesday", () => {
    const Old = new Wait(baseDate).tuesday(1)._getTimestampOrDuration()[0];
    const New = DateTime.tuesday(1)._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Wednesday", () => {
    const Old = new Wait(baseDate).wednesday(2)._getTimestampOrDuration()[0];
    const New = DateTime.wednesday(2)._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Thursday", () => {
    const Old = new Wait(baseDate).thursday()._getTimestampOrDuration()[0];
    const New = DateTime.thursday()._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Friday", () => {
    const Old = new Wait(baseDate).friday()._getTimestampOrDuration()[0];
    const New = DateTime.friday()._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Saturday", () => {
    const Old = new Wait(baseDate).saturday()._getTimestampOrDuration()[0];
    const New = DateTime.saturday()._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Sunday", () => {
    const Old = new Wait(baseDate).sunday()._getTimestampOrDuration()[0];
    const New = DateTime.sunday()._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });
});

describe("Wait/DateTime old/new implementation complex", () => {
  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(baseDate)
      .monday()
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.monday()
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("In 2 weeks at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.weeks(2)
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("In 2 weeks, next mondays at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .monday()
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.weeks(2)
      .monday()
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("In 2 weeks, next 12 of month at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .dayOfMonth(12)
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.weeks(2)
      .dayOfMonth(12)
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("In 2 weeks, next 12 of month, next monday at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .dayOfMonth(12)
      .monday()
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.weeks(2)
      .dayOfMonth(12)
      .monday()
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("At 8 am, next monday, or today if monday before 8 am", () => {
    const Old = new Wait(baseDate)
      .at("8:00")
      .monday()
      ._getTimestampOrDuration()[0];
    const New = DateTime.at("8:00")
      .monday()
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it("Next monday after 2 weeks, at 8 am", () => {
    const Old = new Wait(baseDate)
      .monday()
      .weeks(2)
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.monday()
      .weeks(2)
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });
});

describe("Wait/DateTime old/new implementation special cases 1", () => {
  it("weeks -> dayOfMonth -> at", () => {
    const Old = new Wait(baseDate)
      .weeks(3)
      .dayOfMonth(8)
      .at("12:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.weeks(3)
      .dayOfMonth(8)
      .at("12:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it.skip("dayOfMonth -> weeks -> at", () => {
    const Old = new Wait(baseDate)
      .dayOfMonth(8)
      .weeks(3)
      .at("12:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.dayOfMonth(8)
      .weeks(3)
      .at("12:00")
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });
});

describe("Wait/DateTime old/new implementation special cases 2", () => {
  const date = "2019-08-12T07:26:44.000+00:00";

  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date)
      .monday()
      .at("8:00")
      ._getTimestampOrDuration()[0];
    const New = DateTime.monday()
      .at("8:00")
      ._getDefinition();

    expect(DateTime.get(New, date)).to.be.equals(Old);
  });

  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date)
      .at("8:00")
      .monday()
      ._getTimestampOrDuration()[0];
    const New = DateTime.at("8:00")
      .monday()
      ._getDefinition();

    expect(DateTime.get(New, date)).to.be.equals(Old);
  });

  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date)
      .weeks(2)
      .at("8:00")
      .monday()
      ._getTimestampOrDuration()[0];
    const New = DateTime.weeks(2)
      .at("8:00")
      .monday()
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });

  it.skip("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date)
      .at("8:00")
      .weeks(2)
      .monday()
      ._getTimestampOrDuration()[0];
    const New = DateTime.at("8:00")
      .weeks(2)
      .monday()
      ._getDefinition();

    expect(DateTime.get(New, baseDate)).to.be.equals(Old);
  });
});
