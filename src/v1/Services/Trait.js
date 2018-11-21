// Mixin traits into another trait
const mix = (object, ...traits) => {
  const _traits = [];
  if (object._traits) {
    Array.prototype.push.apply(_traits, object._traits);
  }
  const props = {
    _traits: {
      value: _traits,
      writable: true,
      configurable: true,
    },
  };
  traits.forEach((trait) => {
    if (trait._traits) {
      Array.prototype.push.apply(_traits, trait._traits);
    }
    Object.getOwnPropertyNames(trait).forEach((name) => {
      if (
        name !== "_traits" &&
        !Object.prototype.hasOwnProperty.call(object, name)
      ) {
        props[name] = {
          value: trait[name],
          writable: true,
          configurable: true,
        };
      }
    });
    _traits.push(trait);
  });
  Object.defineProperties(object, props);
  return object;
};

// Mixin traits into a class.
const apply = (baseClass, ...traits) => {
  mix.apply(this, [baseClass.prototype].concat(traits));
  return baseClass;
};

// Checks to see if a class or trait has a trait
const has = (object, trait) => {
  let _traits;
  if (typeof object === "function") {
    // eslint-disable-next-line prefer-destructuring
    _traits = object.prototype._traits;
  } else {
    // eslint-disable-next-line prefer-destructuring
    _traits = object._traits;
  }
  return Array.isArray(_traits) && _traits.indexOf(trait) >= 0;
};

module.exports.mix = mix;
module.exports.apply = apply;
module.exports.has = has;
