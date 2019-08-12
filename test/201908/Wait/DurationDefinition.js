/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const Duration = require("../../../src/201908/Wait/DurationDefinition");

const baseDate = "2019-08-09T16:26:44.929Z";

describe("Duration Definition methods", () => {
  it("get seconds", () => {
    const duration = Duration()
      .seconds(3)
      .get();
    expect(duration).to.be.equals("3:0:0:0:0:0:0");
  });

  it("get minutes", () => {
    const duration = Duration()
      .minutes(3)
      .get();
    expect(duration).to.be.equals("0:3:0:0:0:0:0");
  });

  it("get hours", () => {
    const duration = Duration()
      .hours(3)
      .get();
    expect(duration).to.be.equals("0:0:3:0:0:0:0");
  });

  it("get days", () => {
    const duration = Duration()
      .days(3)
      .get();
    expect(duration).to.be.equals("0:0:0:3:0:0:0");
  });

  it("get weeks", () => {
    const duration = Duration()
      .weeks(42)
      .get();
    expect(duration).to.be.equals("0:0:0:0:42:0:0");
  });

  it("get months", () => {
    const duration = Duration()
      .months(3)
      .get();
    expect(duration).to.be.equals("0:0:0:0:0:3:0");
  });

  it("get years", () => {
    const duration = Duration()
      .years(3)
      .get();
    expect(duration).to.be.equals("0:0:0:0:0:0:3");
  });

  it("chaining methods", () => {
    const duration = Duration()
      .seconds(3)
      .minutes(3)
      .hours(3)
      .days(3)
      .weeks(3)
      .months(3)
      .years(3)
      .get();
    expect(duration).to.be.equals("3:3:3:3:3:3:3");
  });
});

describe("Duration Definition compute", () => {
  it("compute seconds", () => {
    expect(Duration.compute("12:0:0:0:0:0:0")).to.be.equals(12);
  });

  it("compute minutes", () => {
    expect(Duration.compute("12:2:0:0:0:0:0", baseDate)).to.be.equals(132);
  });

  it("compute hours", () => {
    expect(Duration.compute("12:2:1:0:0:0:0", baseDate)).to.be.equals(3732);
  });

  it("compute days", () => {
    expect(Duration.compute("12:2:1:2:0:0:0", baseDate)).to.be.equals(176532);
  });

  it("compute weeks", () => {
    expect(Duration.compute("12:2:1:2:2:0:0", baseDate)).to.be.equals(1386132);
  });

  it("compute months", () => {
    expect(Duration.compute("12:2:1:2:2:1:0", baseDate)).to.be.equals(4064532);
  });

  it("compute years", () => {
    expect(Duration.compute("12:2:1:2:2:1:1", baseDate)).to.be.equals(35686932);
  });
});
