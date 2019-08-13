const { InternalZenatonError } = require("../../Errors");

const objectify = function objectify(Class) {
  if (typeof Class !== "function") {
    throw new InternalZenatonError(
      `Parameter of "objectify" must be a function, not a "${typeof Class}"`,
    );
  }
  // copy public methods to provide a new instance with this method applied
  const obj = {};
  Object.getOwnPropertyNames(Class.prototype).forEach((method) => {
    if (method !== "constructor" && !method.startsWith("_")) {
      obj[method] = (...args) => new Class()[method](...args);
    }
  });

  return obj;
};

module.exports = objectify;
