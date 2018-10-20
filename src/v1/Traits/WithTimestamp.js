const moment = require("moment-timezone");
const Trait = require("../Services/Trait");
const WithDuration = require("./WithDuration");
const { ExternalZenatonError, InternalZenatonError } = require("../../Errors");

const MODE_AT = "AT";
const MODE_WEEK_DAY = "WEEK_DAY";
const MODE_MONTH_DAY = "MONTH_DAY";
const MODE_TIMESTAMP = "TIMESTAMP";

module.exports = Trait.mix(
  {
    _getTimestampOrDuration() {
      if (undefined === this._buffer) {
        return [null, null];
      }

      let [now, then] = this._initNowThen();

      this._mode = null;
      // apply buffered methods
      this._buffer.forEach((call) => {
        then = this._apply(call[0], call[1], now, then);
      });
      // has user used a method by timestamp?
      const isTimestamp = this._mode !== null;
      // remove attribute to avoid having it in linearization
      delete this._mode;
      // return
      if (isTimestamp) {
        return [then.unix(), null];
      }
      return [null, then.diff(now, "seconds")];
    },

    timestamp(value) {
      this._push(["timestamp", value]);

      return this;
    },

    at(value) {
      this._push(["at", value]);

      return this;
    },

    dayOfMonth(value) {
      this._push(["dayOfMonth", value]);

      return this;
    },

    monday(value = 1) {
      this._push(["monday", value]);

      return this;
    },

    tuesday(value = 1) {
      this._push(["tuesday", value]);

      return this;
    },

    wednesday(value = 1) {
      this._push(["wednesday", value]);

      return this;
    },

    thursday(value = 1) {
      this._push(["thursday", value]);

      return this;
    },

    friday(value = 1) {
      this._push(["friday", value]);

      return this;
    },

    saturday(value = 1) {
      this._push(["saturday", value]);

      return this;
    },

    sunday(value = 1) {
      this._push(["sunday", value]);

      return this;
    },

    _timestamp(timestamp) {
      this._setMode(MODE_TIMESTAMP);

      return moment.unix(timestamp);
    },

    _at(time, now, then) {
      this._setMode(MODE_AT);

      const segments = time.split(":");
      const h = parseInt(segments[0]);
      const m = segments.length > 1 ? parseInt(segments[1]) : 0;
      const s = segments.length > 2 ? parseInt(segments[2]) : 0;

      then = then.set({ hour: h, minute: m, second: s });

      if (now.isAfter(then)) {
        switch (this._mode) {
          case MODE_AT:
            then = then.add(1, "days");
            break;
          case MODE_WEEK_DAY:
            then = then.add(1, "weeks");
            break;
          case MODE_MONTH_DAY:
            then = then.add(1, "months");
            break;
          default:
            throw new InternalZenatonError(`Unknown mode: ${this._mode}`);
        }
      }

      return then;
    },

    _dayOfMonth(day, now, then) {
      this._setMode(MODE_MONTH_DAY);

      then = then.set("date", day);

      if (now.isAfter(then)) {
        then = then.add(1, "months");
      }

      return then;
    },

    _weekDay(n, day, then) {
      this._setMode(MODE_WEEK_DAY);

      const d = then.isoWeekday();
      then = then.add(day - d, "days");
      then = d > day ? then.add(n, "weeks") : then.add(n - 1, "weeks");

      return then;
    },

    _apply(method, value, now, then) {
      switch (method) {
        case "timestamp":
          return this._timestamp(value, then);
        case "at":
          return this._at(value, now, then);
        case "dayOfMonth":
          return this._dayOfMonth(value, now, then);
        case "monday":
          return this._weekDay(value, 1, then);
        case "tuesday":
          return this._weekDay(value, 2, then);
        case "wednesday":
          return this._weekDay(value, 3, then);
        case "thursday":
          return this._weekDay(value, 4, then);
        case "friday":
          return this._weekDay(value, 5, then);
        case "saturday":
          return this._weekDay(value, 6, then);
        case "sunday":
          return this._weekDay(value, 7, then);
        default:
          return this._applyDuration(method, value, then);
      }
    },

    _setMode(mode) {
      // can not apply twice the same method
      if (mode === this._mode) {
        throw new ExternalZenatonError(
          "Incompatible definition in Wait methods",
        );
      }
      // timestamp can only be used alone
      if (
        (this._mode !== null && MODE_TIMESTAMP === mode) ||
        MODE_TIMESTAMP === this._mode
      ) {
        throw new ExternalZenatonError(
          "Incompatible definition in Wait methods",
        );
      }
      // other mode takes precedence to MODE_AT
      if (this._mode === null || MODE_AT === this._mode) {
        this._mode = mode;
      }
    },
  },
  WithDuration,
);
