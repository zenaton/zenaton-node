// eslint-disable-next-line node/no-unpublished-require
const { Trait } = require("./src/async/Services");
// eslint-disable-next-line node/no-unpublished-require
const WithTimestamp = require("./src/async/Traits/WithTimestamp");

class WaitDummyClass {
  constructor() {
    this.data = {};
  }
}

const Wait = Trait.apply(WaitDummyClass, WithTimestamp);

const res = new Wait().seconds(3)._getTimestampOrDuration();
console.log(res);
