/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const Duration = require("../../../src/Code/yield/Services/Duration");

const baseDate = "2019-08-09T16:26:44.929Z";

describe("Duration Definition methods", () => {
  it("get seconds", () => {
    const duration = Duration.seconds(3)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(3);
  });

  it("get minutes", () => {
    const duration = Duration.minutes(3)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(180);
  });

  it("get hours", () => {
    const duration = Duration.hours(3)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(10800);
  });

  it("get days", () => {
    const duration = Duration.days(3)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(259200);
  });

  it("get weeks", () => {
    const duration = Duration.weeks(42)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(25401600);
  });

  it("get months", () => {
    const duration = Duration.months(3)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(7948800);
  });

  it("get years", () => {
    const duration = Duration.years(3)._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(94694400);
  });

  it("chaining methods", () => {
    const duration = Duration.seconds(3)
      .minutes(3)
      .hours(3)
      .days(3)
      .weeks(3)
      .months(3)
      .years(3)
      ._getDefinition();
    expect(Duration.get(duration, baseDate)).to.be.equals(104641383);
  });
});
