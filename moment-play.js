const moment = require("moment-timezone");
// eslint-disable-next-line node/no-unpublished-require
const duration = require("./src/2019-08/Wait/DurationDefinition");
// eslint-disable-next-line node/no-unpublished-require
const timeDef = require("./src/2019-08/Wait/TimeDefinition");

// eslint-disable-next-line node/no-unpublished-require
const time = require("./src/2019-08/Wait/Time");

// const trait = require("./src/2019-08/Traits/WithTimestamp");

const m1 = moment();
const m2 = m1.clone();
console.log("moment1", m1);
console.log("moment1", m2.add(3, "months"));

console.log("default tz", moment.tz.guess());

console.log("duration", duration.compute("12:2:0:0:0:0:0"));
console.log(
  "TIME",
  time
    .monday()
    .at("12:00")
    .get(),
);
console.log(
  "time",
  moment.unix(
    timeDef.compute(
      time
        .monday()
        .at("12:00")
        .get(),
    ),
  ),
);

console.log(
  "time",
  moment.unix(
    timeDef.compute(
      time
        .dayOfMonth(9)
        .at("16:35")
        .get(),
    ),
  ),
);

// console.log("TRAIT", trait);
