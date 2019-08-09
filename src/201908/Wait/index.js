const WaitDefinition = require("./WaitDefinition");

module.exports = class Wait {
  static forever() {
    return WaitDefinition().forever();
  }

  static for(duration) {
    return WaitDefinition().for(duration);
  }

  static until(timestamp) {
    return WaitDefinition().until(timestamp);
  }

  static event(event) {
    return WaitDefinition().event(event);
  }
};
