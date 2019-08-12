/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const { Trait } = require("../../../src/async/Services");
const WithTimestamp = require("../../../src/async/Traits/WithTimestamp");
const Time = require("../../../src/201908/Wait/TimeDefinition");
const Duration = require("../../../src/201908/Wait/DurationDefinition");

const baseDate = "2019-08-09T16:26:44.929Z";

class WaitDummyClass {
  constructor(date) {
    this.data = {};
    this.data._$baseDate = date;
  }
}

const Wait = Trait.apply(WaitDummyClass, WithTimestamp);

describe("Wait/DateTime old/new implementation simple", () => {
  it("Timestamp", () => {
    const Old = new Wait().timestamp(1234567);
    const New = Time().timestamp(1234567);

    expect(New.get()).to.be.equals(Old._getTimestampOrDuration()[0]);
  });

  it("Seconds", () => {
    const Old = new Wait(baseDate).seconds(30);
    const New = Duration().seconds(30);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Minutes", () => {
    const Old = new Wait(baseDate).minutes(15);
    const New = Duration().minutes(15);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Hours", () => {
    const Old = new Wait(baseDate).hours(2);
    const New = Duration().hours(2);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Days", () => {
    const Old = new Wait(baseDate).days(1);
    const New = Duration().days(1);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Weeks", () => {
    const Old = new Wait(baseDate).weeks(1);
    const New = Duration().weeks(1);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Months", () => {
    const Old = new Wait(baseDate).months(2);
    const New = Duration().months(2);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Years", () => {
    const Old = new Wait(baseDate).years(10);
    const New = Duration().years(10);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("Combine durations", () => {
    const Old = new Wait(baseDate)
      .seconds(30)
      .minutes(15)
      .hours(2)
      .days(1)
      .weeks(1)
      .months(2)
      .years(10);
    const New = Duration()
      .seconds(30)
      .minutes(15)
      .hours(2)
      .days(1)
      .weeks(1)
      .months(2)
      .years(10);

    expect(Duration.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[1],
    );
  });

  it("At", () => {
    const Old = new Wait(baseDate).at("15:10:23");
    const New = Time().at("15:10:23");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("DayOfMonth", () => {
    const Old = new Wait(baseDate).dayOfMonth(12);
    const New = Time().dayOfMonth(12);

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Monday", () => {
    const Old = new Wait(baseDate).monday();
    const New = Time().monday();

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Tuesday", () => {
    const Old = new Wait(baseDate).tuesday(1);
    const New = Time().tuesday(1);

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Wednesday", () => {
    const Old = new Wait(baseDate).wednesday(2);
    const New = Time().wednesday(2);

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Thursday", () => {
    const Old = new Wait(baseDate).thursday();
    const New = Time().thursday();

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Friday", () => {
    const Old = new Wait(baseDate).friday();
    const New = Time().friday();

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Saturday", () => {
    const Old = new Wait(baseDate).saturday();
    const New = Time().saturday();

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Sunday", () => {
    const Old = new Wait(baseDate).sunday();
    const New = Time().sunday();

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });
});

describe("Wait/DateTime old/new implementation complex", () => {
  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(baseDate).monday().at("8:00");
    const New = Time()
      .monday()
      .at("8:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("In 2 weeks at 8 am", () => {
    const Old = new Wait(baseDate).weeks(2).at("8:00");
    const New = Time()
      .weeks(2)
      .at("8:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("In 2 weeks, next mondays at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .monday()
      .at("8:00");
    const New = Time()
      .weeks(2)
      .monday()
      .at("8:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("In 2 weeks, next 12 of month at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .dayOfMonth(12)
      .at("8:00");
    const New = Time()
      .weeks(2)
      .dayOfMonth(12)
      .at("8:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("In 2 weeks, next 12 of month, next monday at 8 am", () => {
    const Old = new Wait(baseDate)
      .weeks(2)
      .dayOfMonth(12)
      .monday()
      .at("8:00");
    const New = Time()
      .weeks(2)
      .dayOfMonth(12)
      .monday()
      .at("8:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("At 8 am, next monday, or today if monday before 8 am", () => {
    const Old = new Wait(baseDate).at("8:00").monday();
    const New = Time()
      .at("8:00")
      .monday();

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Next monday after 2 weeks, at 8 am", () => {
    const Old = new Wait(baseDate)
      .monday()
      .weeks(2)
      .at("8:00");
    const New = Time()
      .monday()
      .weeks(2)
      .at("8:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });
});

describe("Wait/DateTime old/new implementation special cases 1", () => {
  const date = "2019-08-12T07:26:44.000+00:00";

  it("weeks -> dayOfMonth -> at", () => {
    const Old = new Wait(baseDate)
      .weeks(3)
      .dayOfMonth(8)
      .at("12:00");
    const New = Time()
      .weeks(3)
      .dayOfMonth(8)
      .at("12:00");

    expect(Time.compute(New.get(), date)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it.skip("dayOfMonth -> weeks -> at", () => {
    const Old = new Wait(baseDate)
      .dayOfMonth(8)
      .weeks(3)
      .at("12:00");
    const New = Time()
      .dayOfMonth(8)
      .weeks(3)
      .at("12:00");

    expect(Time.compute(New.get(), baseDate)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });
});

describe("Wait/DateTime old/new implementation special cases 2", () => {
  const date = "2019-08-12T07:26:44.000+00:00";

  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date).monday().at("8:00");
    const New = Time()
      .monday()
      .at("8:00");

    expect(Time.compute(New.get(), date)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date).at("8:00").monday();
    const New = Time()
      .at("8:00")
      .monday();

    expect(Time.compute(New.get(), date)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date)
      .weeks(2)
      .at("8:00")
      .monday();
    const New = Time()
      .weeks(2)
      .at("8:00")
      .monday();

    expect(Time.compute(New.get(), date)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });

  it.skip("Next mondays at 8 am, or today if monday before 8 am", () => {
    const Old = new Wait(date)
      .at("8:00")
      .weeks(2)
      .monday();
    const New = Time()
      .at("8:00")
      .weeks(2)
      .monday();

    expect(Time.compute(New.get(), date)).to.be.equals(
      Old._getTimestampOrDuration()[0],
    );
  });
});
