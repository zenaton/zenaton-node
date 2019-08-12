/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const Time = require("../../../src/201908/Wait/TimeDefinition");

const baseDate = "2019-08-09T16:26:44.929Z";

describe("DateTime Definition methods", () => {
  it("set timestamp", () => {
    const time = Time()
      .timestamp(1234567)
      .get();
    expect(time).to.be.equals(1234567);
  });

  it("set time", () => {
    const time = Time()
      .at("12:00")
      .get();
    expect(time).to.be.deep.equals({ at: "12:00" });
  });

  it("set dayOfMonth", () => {
    const time = Time()
      .dayOfMonth(11)
      .get();
    expect(time).to.be.deep.equals({ dayOfMonth: 11 });
  });

  it("set monday", () => {
    const time = Time()
      .monday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [1, 1] });
  });

  it("set tuesday", () => {
    const time = Time()
      .tuesday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [2, 1] });
  });

  it("set thursday", () => {
    const time = Time()
      .wednesday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [3, 1] });
  });

  it("set thursday", () => {
    const time = Time()
      .thursday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [4, 1] });
  });

  it("set friday", () => {
    const time = Time()
      .friday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [5, 1] });
  });

  it("set saturday", () => {
    const time = Time()
      .saturday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [6, 1] });
  });

  it("set sunday", () => {
    const time = Time()
      .sunday()
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [7, 1] });
  });

  it("set monday with count", () => {
    const time = Time()
      .monday(3)
      .get();
    expect(time).to.be.deep.equals({ dayOfWeek: [1, 3] });
  });

  it("set a duration in seconds", () => {
    const time = Time()
      .seconds(3)
      .get();
    expect(time).to.be.deep.equals({ duration: "3:0:0:0:0:0:0" });
  });

  it("set a complex duration", () => {
    const time = Time()
      .seconds(3)
      .minutes(3)
      .hours(3)
      .days(3)
      .weeks(3)
      .months(3)
      .years(3)
      .get();
    expect(time).to.be.deep.equals({ duration: "3:3:3:3:3:3:3" });
  });
});

describe("Duration Definition compute", () => {
  it("compute timestamp", () => {
    expect(Time.compute(1234567)).to.be.equals(1234567);
  });

  it("compute time", () => {
    // 1565431200 = Saturday 10 August 2019 10:00:00
    expect(Time.compute({ at: "12:00" }, baseDate)).to.be.equals(1565431200);
  });

  it("compute day of month", () => {
    // 1565540804 = Sunday 11 August 2019 16:26:44
    expect(Time.compute({ dayOfMonth: 11 }, baseDate)).to.be.equals(1565540804);
  });

  it("compute day of month at time", () => {
    // 1567951200 = Sunday 8 September 2019 14:00:00
    const time = Time()
      .dayOfMonth(8)
      .at("16:00");
    expect(Time.compute(time.get(), baseDate)).to.be.equals(1567951200);
  });

  it("compute day of week", () => {
    // 1565627204 = Monday 12 August 2019 16:26:44
    const time = Time().monday();
    expect(Time.compute(time.get(), baseDate)).to.be.equals(1565627204);
  });

  it("compute day of week at time", () => {
    // 1565589600 = Monday 12 August 2019 06:00:00
    const time = Time()
      .monday()
      .at("08:00");
    expect(Time.compute(time.get(), baseDate)).to.be.equals(1565589600);
  });
  /*
  it.only("compute duration at time 1", () => {
    // 1567141200 = Friday 30 August 2019 05:00:00
    const time = Time()
      .dayOfMonth(8)
      .weeks(3)
      .at("12:00");
    expect(Time.compute(time.get(), baseDate)).to.be.equals(1567141200);
  });

  it.only("compute duration at time 2", () => {
    // 1567141200 = Friday 30 August 2019 05:00:00
    const time = Time()
      .weeks(3)
      .dayOfMonth(8)
      .at("12:00");
    expect(Time.compute(time.get(), baseDate)).to.be.equals(1567141200);
  }); */
});
