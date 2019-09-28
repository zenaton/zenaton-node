/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const { Trait } = require("../../../src/Code/async/Services");
const WithTimestamp = require("../../../src/Code/async/Traits/WithTimestamp");

class WaitDummyClass {
  constructor() {
    this.data = {};
    this.data._$baseDate = "2019-08-09T16:26:44.929Z";
  }
}

WaitDummyClass.timezone = function timezoneFunc(timezone) {
  this._timezone = timezone;
};

const Wait = Trait.apply(WaitDummyClass, WithTimestamp);
Wait.timezone("UTC");

it("wait duration at time", () => {
  // 1567141200 = Friday 30 August 2019 05:00:00
  const wait = new Wait().weeks(3).at("07:00");
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1567148400, null]);
});

it("wait timestamp", () => {
  const wait = new Wait().timestamp(1234567);
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1234567, null]);
});

it("wait time", () => {
  // 1565431200 = Saturday 10 August 2019 10:00:00
  const wait = new Wait().at("12:00");
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1565438400, null]);
});

it("wait day of month", () => {
  // 1565540804 = Sunday 11 August 2019 16:26:44
  const wait = new Wait().dayOfMonth(11);
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1565540804, null]);
});

it("wait day of month at time", () => {
  // 1567951200 = Sunday 8 September 2019 14:00:00
  const wait = new Wait().dayOfMonth(8).at("16:00");
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1567958400, null]);
});

it("wait day of week", () => {
  // 1565627204 = Sunday 8 September 2019 14:00:00
  const wait = new Wait().monday();
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1565627204, null]);
});

it("wait day of week at time", () => {
  // 1565589600 = Monday 12 August 2019 06:00:00
  const wait = new Wait().monday().at("08:00");
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1565596800, null]);
});

it("wait duration at time", () => {
  // 1567141200 = Friday 30 August 2019 05:00:00
  const wait = new Wait().weeks(3).at("7:00");
  expect(wait._getTimestampOrDuration()).to.be.deep.equals([1567148400, null]);
});
