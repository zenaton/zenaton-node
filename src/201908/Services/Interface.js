const InternalZenatonError = require("../../Errors/InternalZenatonError");

class Interface {
  constructor(...methods) {
    if (!Array.isArray(methods)) {
      throw new InternalZenatonError(
        'The "methods" argument must be an array of string',
      );
    }

    this.methods = [];
    methods.forEach((method) => {
      if (typeof method !== "string") {
        throw new InternalZenatonError(
          'The "methods" argument must contains only string',
        );
      }
      this.methods.push(method);
    });
  }

  static check(object, ...interfaces) {
    if (!Array.isArray(interfaces) || interfaces.length === 0) {
      throw new InternalZenatonError(
        'The "interfaces" argument must be a non-empty array of Interface',
      );
    }

    interfaces.forEach((itf) => {
      if (itf.constructor !== Interface) {
        throw new InternalZenatonError(
          'The "interfaces" argument must contains instances of Interface',
        );
      }

      const missingMethods = [];
      itf.methods.forEach((method) => {
        if (!object[method] || typeof object[method] !== "function") {
          missingMethods.push(method);
        }
      });

      if (missingMethods.length > 0) {
        throw new InternalZenatonError(
          `Methods not found : ${missingMethods.join(", ")}`,
        );
      }
    });
  }
}

module.exports = Interface;
